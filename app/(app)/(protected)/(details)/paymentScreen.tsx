// app/(app)/(protected)/(details)/paymentScreen.tsx

import React, { useCallback, useState } from "react";
import { StyleSheet, View, Pressable, Modal, ScrollView, Platform } from "react-native"; // Added Platform
import { useSelector } from "react-redux";
import { RootState } from '@/store';
import useDataFetching from '@/hooks/useDataFetching';
import { formatCurrency, formatDate } from '@/utils';
import { paymentService, PaymentData } from '@/services/paymentService';
import { Ionicons } from '@expo/vector-icons';
import { showToast } from '@/helpers/toast/showToast';
import { ToastColorEnum } from '@/components/ToastMessage/ToastColorEnum';
import Constants from 'expo-constants'; // Import Constants

import {
  CsCard,
  CsText,
  AnimatedFlatList,
  LoadingScreen,
  SummaryCard,
  CsButton,
  CsDivider,
} from "@/components";

import { useTheme, useThemedStyles } from "@/hooks";

import { type ITheme, shadows, spacing } from "@/styles";
import borderRadius from "@/styles/borderRadius";
import { Header } from "@/components/Header";

type TabType = 'installments' | 'history';
type FilterStatus = 'all' | 'pending' | 'paid' | 'overdue';
type ListItem = PaymentData['installments'][0] | PaymentData['payments'][0];


const PaymentScreen: React.FC = () => {

  const selectedStudent = useSelector((state: RootState) => state.AppReducer.selectedStudent);
  const theme = useTheme();
  const themedStyles = useThemedStyles(styles);

  const [activeTab, setActiveTab] = useState<TabType>('installments');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInstallment, setSelectedInstallment] = useState<PaymentData['installments'][0] | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>('all');

  const fetchPaymentData = async () => {
    if (!selectedStudent) return null;
    return await paymentService.fetchPaymentData(selectedStudent.id);
  };

  const {
    data,
    loading,
    refreshing,
    fetchData: refetchData,
  } = useDataFetching<PaymentData>(fetchPaymentData, [selectedStudent]);

  const handlePaymentInitiation = async (paymentMethod: string) => {
    if (!selectedStudent?.id || !selectedInstallment) return;

    setProcessingPayment(true);
    setPaymentError(null);
    try {
      const result = await paymentService.initiatePayment(
        selectedStudent.id,
        selectedInstallment.amount,
        paymentMethod
      );

      if (result.success) {
        showToast("Paiement initié avec succès!", ToastColorEnum.Success);
        await refetchData();
        setShowPaymentModal(false);
        setSelectedInstallment(null);
      } else {
        setPaymentError(result.error || "Échec de l'initiation du paiement.");
        showToast(result.error || "Échec du paiement", ToastColorEnum.Error);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Une erreur inconnue est survenue.";
      setPaymentError(message);
      showToast(message, ToastColorEnum.Error);
    } finally {
      setProcessingPayment(false);
    }
  };

  const getStatusInfo = (status: FilterStatus | 'pending' | 'paid') => {
    switch (status) {
      case 'paid':
        return { icon: 'checkmark-circle' as const, color: theme.success, text: 'Payé' };
      case 'pending':
        return { icon: 'hourglass-outline' as const, color: theme.warning, text: 'En attente' };
      case 'overdue':
        return { icon: 'alert-circle' as const, color: theme.error, text: 'En retard' };
      default:
        return { icon: 'help-circle-outline' as const, color: theme.textLight, text: status };
    }
  };

  const renderListItem = useCallback(({ item }: { item: ListItem }) => {
    if ('due_date' in item) {
      // Installment item
      const statusInfo = getStatusInfo(item.status as FilterStatus | 'pending');
      const isPayable = item.status === 'pending' || item.status === 'overdue';

      return (
        <CsCard style={themedStyles.listItemCard}>
          <View style={themedStyles.listItemContent}>
            <View style={themedStyles.listItemTextContainer}>
              <CsText style={themedStyles.amount}>{formatCurrency(item.amount)}</CsText>
              <CsText style={themedStyles.date}>Échéance: {formatDate(item.due_date, 'd MMM yyyy')}</CsText>
            </View>
            <View style={[themedStyles.statusContainer]}>
              <Ionicons name={statusInfo.icon} size={18} color={statusInfo.color} style={themedStyles.statusIcon} />
              <CsText style={StyleSheet.flatten([themedStyles.statusText, { color: statusInfo.color }])}>{statusInfo.text}</CsText>
            </View>
          </View>
          {isPayable && (
            <CsButton
              size="small"
              style={themedStyles.payButton}
              onPress={() => {
                setSelectedInstallment(item);
                setPaymentError(null);
                setShowPaymentModal(true);
              }}
              title="Payer"
              icon={<Ionicons name="card-outline" size={16} color={theme.background} />}
            />
          )}
        </CsCard>
      );
    } else {
      // Payment item (History)
      const statusInfo = getStatusInfo('paid');
      return (
        <CsCard style={themedStyles.listItemCard}>
          <View style={themedStyles.listItemContent}>
            <View style={themedStyles.listItemTextContainer}>
              <CsText style={themedStyles.amount}>{formatCurrency(item.amount)}</CsText>
              <CsText style={themedStyles.date}>Payé le: {formatDate(item.paid_at || '', 'd MMM yyyy, HH:mm')}</CsText>
            </View>
            <View style={[themedStyles.statusContainer]}>
              <Ionicons name={statusInfo.icon} size={18} color={statusInfo.color} style={themedStyles.statusIcon} />
              <CsText style={StyleSheet.flatten([themedStyles.statusText, { color: statusInfo.color }])}>{statusInfo.text}</CsText>
            </View>
          </View>
        </CsCard>
      );
    }
  }, [themedStyles, theme]);

  const summaryItems = () => {
    const { totalAmount, remainingAmount } = data?.stats ?? { totalAmount: 0, remainingAmount: 0 };

    return [
      {
        label: "Total",
        value: formatCurrency(totalAmount),
        icon: "checkmark-done-circle-outline" as const,
        color: theme.success,
      },
      {
        label: "Reste à Payer",
        value: formatCurrency(remainingAmount),
        icon: "alert-circle-outline" as const,
        color: remainingAmount > 0 ? theme.warning : theme.success,
      },
    ];
  };

  const filteredData = () => {
    if (!data) return { installments: [], payments: [] };

    const filteredInstallments = selectedStatus === 'all'
      ? data.installments
      : data.installments.filter(item => item.status === selectedStatus);

    // Sort installments: overdue first, then pending, then paid
    filteredInstallments.sort((a, b) => {
      const statusOrder = { 'overdue': 1, 'pending': 2, 'paid': 3 };
      const orderA = statusOrder[a.status as keyof typeof statusOrder] ?? 4;
      const orderB = statusOrder[b.status as keyof typeof statusOrder] ?? 4;
      if (orderA !== orderB) return orderA - orderB;
      // If status is the same, sort by due date (earliest first)
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    });


    return {
      installments: filteredInstallments,
      payments: data.payments
    };
  };

  const renderFilters = () => {
    const filters: { label: string; value: FilterStatus }[] = [
      { label: 'Tout', value: 'all' },
      { label: 'Payé', value: 'paid' },
      { label: 'En retard', value: 'overdue' },
      { label: 'En attente', value: 'pending' },
    ];

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {filters.map(({ label, value }) => {
          const buttonStyle = StyleSheet.flatten([
            themedStyles.filterButton,
            selectedStatus === value && themedStyles.activeFilter,
          ]);

          const textStyle = StyleSheet.flatten([
            themedStyles.filterText,
            selectedStatus === value && themedStyles.activeFilterText,
          ]);

          return (
            <Pressable
              key={value}
              style={buttonStyle}
              onPress={() => setSelectedStatus(value)}
              android_ripple={{ color: theme.rippleColor, borderless: false }}
            >
              <CsText style={textStyle}>
                {label}
              </CsText>
            </Pressable>
          );
        })}
      </ScrollView>
    );
  };

  const handleNewPayment = () => {
    // Find the earliest overdue or pending installment
    const nextInstallment = data?.installments
      .filter(i => i.status === 'pending' || i.status === 'overdue')
      .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())[0];

    if (nextInstallment) {
      setSelectedInstallment(nextInstallment);
      setPaymentError(null);
      setShowPaymentModal(true);
    } else {
      showToast("Aucune tranche en attente ou en retard à payer.", ToastColorEnum.Info);
    }
  };

  const renderPaymentModal = () => {
    if (!showPaymentModal || !selectedInstallment) return null;

    const dueDate = formatDate(selectedInstallment.due_date, 'd MMMM yyyy');
    const isOverdue = selectedInstallment.status === 'overdue';

    return (
      <Modal
        visible={showPaymentModal}
        transparent
        animationType="fade"
        onRequestClose={() => !processingPayment && setShowPaymentModal(false)}
      >
        <Pressable
          style={themedStyles.modalOverlay}
          onPress={() => !processingPayment && setShowPaymentModal(false)}
        >
          {/* Prevent closing when clicking inside the card */}
          <Pressable style={themedStyles.modalCard} onPress={() => { }}>
            {/* Header */}
            <View style={themedStyles.modalHeader}>
              <CsText variant="h3" style={themedStyles.modalTitle}>
                Payer la tranche
              </CsText>
              <Pressable
                style={themedStyles.closeButton}
                onPress={() => !processingPayment && setShowPaymentModal(false)}
                disabled={processingPayment}
                hitSlop={10}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={themedStyles.closeIcon.color}
                />
              </Pressable>
            </View>

            {/* Payment Details */}
            <View style={themedStyles.paymentDetails}>
              <View style={themedStyles.paymentRow}>
                <CsText style={themedStyles.paymentLabel}>Montant</CsText>
                <CsText style={themedStyles.paymentValue}>
                  {formatCurrency(selectedInstallment.amount)}
                </CsText>
              </View>
              <View style={themedStyles.paymentRow}>
                <CsText style={themedStyles.paymentLabel}>Échéance</CsText>
                <CsText
                  style={StyleSheet.flatten([
                    themedStyles.paymentValue,
                    isOverdue && { color: theme.error }
                  ])}
                >
                  {dueDate} {isOverdue && '(En retard)'}
                </CsText>
              </View>
            </View>

            <CsDivider />

            {/* Error Message Area */}
            {paymentError && (
              <View style={themedStyles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={20} color={theme.error} style={{ marginRight: spacing.sm }} />
                <CsText style={themedStyles.errorText}>{paymentError}</CsText>
              </View>
            )}

            {/* Payment Methods */}
            <CsText style={themedStyles.modalSubtitle}>
              Sélectionnez un mode de paiement
            </CsText>

            <CsButton
              title="Mobile Money"
              onPress={() => handlePaymentInitiation('mobile_money')}
              loading={processingPayment}
              disabled={processingPayment}
              style={themedStyles.paymentMethodButton}
              icon={<Ionicons name="phone-portrait-outline" size={20} color={theme.background} />}
            />

            <CsButton
              title="Transfert Bancaire"
              onPress={() => handlePaymentInitiation('bank_transfer')}
              loading={processingPayment}
              disabled={processingPayment}
              style={themedStyles.paymentMethodButton}
              icon={<Ionicons name="card-outline" size={20} color={theme.background} />}
            />
          </Pressable>
        </Pressable>
      </Modal>
    );
  };

  if (loading && !data) return <LoadingScreen />;

  if (!data && !loading) return (
    <View style={themedStyles.emptyState}>
      <Ionicons name="cloud-offline-outline" size={48} color={theme.textLight} />
      <CsText style={{ marginTop: spacing.md, color: theme.textLight, textAlign: 'center' }}>
        Impossible de charger les données de paiement. Vérifiez votre connexion et réessayez.
      </CsText>
      <CsButton title="Réessayer" onPress={refetchData} style={{ marginTop: spacing.lg }} />
    </View>
  );

  const hasPendingInstallments = data?.installments.some(i => i.status === 'pending' || i.status === 'overdue');

  return (
    <View style={themedStyles.container}>
      <Header
        title="Scolarité"
      >
        {/* Filters - Render only when needed */}
        {activeTab === 'installments' && renderFilters()}
      </Header>

      {/* List */}
      <AnimatedFlatList<ListItem>
        data={activeTab === 'installments' ? filteredData().installments : filteredData().payments}
        renderItem={renderListItem}
        keyExtractor={(item) => item.id.toString()}
        onRefresh={refetchData}
        refreshing={refreshing || loading}
        ListHeaderComponent={
          <>
            <SummaryCard
              items={summaryItems()}
              primaryColor={theme.primary}
              successColor={theme.success}
              warningColor={theme.warning}
            />


            {/* Tabs */}
            <View style={themedStyles.tabContainer}>
              <Pressable
                style={[
                  themedStyles.tab,
                  activeTab === 'installments' && themedStyles.activeTab,
                ]}
                onPress={() => setActiveTab('installments')}
                android_ripple={{ color: theme.rippleColor }}
              >
                <CsText
                  variant="body"
                  style={StyleSheet.flatten([
                    themedStyles.tabText,
                    activeTab === 'installments' && themedStyles.activeTabText
                  ])}
                >
                  Tranches
                </CsText>
              </Pressable>
              <Pressable
                style={[
                  themedStyles.tab,
                  activeTab === 'history' && themedStyles.activeTab,
                ]}
                onPress={() => setActiveTab('history')}
                android_ripple={{ color: theme.rippleColor }}
              >
                <CsText
                  variant="body"
                  style={StyleSheet.flatten([
                    themedStyles.tabText,
                    activeTab === 'history' && themedStyles.activeTabText
                  ])}
                >
                  Historique
                </CsText>
              </Pressable>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={themedStyles.emptyListContainer}>
            <Ionicons name={activeTab === 'installments' ? "receipt-outline" : "archive-outline"} size={48} color={theme.textLight} />
            <CsText variant="body" style={{ marginTop: spacing.md, color: theme.textLight }}>
              Aucun(e) {activeTab === 'installments' ? 'tranche' : 'historique'} trouvé(e)
              {activeTab === 'installments' && selectedStatus !== 'all' ? ` pour le statut '${selectedStatus}'` : ''}.
            </CsText>
          </View>
        }
        // Increase paddingBottom when FAB is visible
        contentContainerStyle={{ paddingBottom: hasPendingInstallments ? 100 : 20 }}
        style={{ flex: 1 }}
      />

      {/* New Payment FAB */}
      {activeTab === 'installments' && hasPendingInstallments && (
        <View style={themedStyles.fab}>
          <Pressable
            onPress={handleNewPayment}
            android_ripple={{ color: theme.rippleColor, borderless: true }}
          >
            <Ionicons name="add" size={28} color={theme.background} />
          </Pressable>
        </View>
      )}

      {/* Payment Modal */}
      {renderPaymentModal()}
    </View>
  );
};


const styles = (theme: ITheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    // Add padding top for status bar, especially needed on Android
    paddingTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0,
  },
  header: {
    paddingHorizontal: spacing.md,
    // Removed paddingTop here, handled by container now
    paddingBottom: spacing.sm,
    backgroundColor: theme.background,
  },
  title: {
    marginBottom: spacing.xs,
    color: theme.text,
  },
  studentInfo: {
    color: theme.textLight,
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: spacing.md,
    marginBottom: spacing.md,
    marginHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: theme.primary,
  },
  tabText: {
    color: theme.textLight,
    fontWeight: '500',
  },
  activeTabText: {
    color: theme.primary,
    fontWeight: '700',
  },
  listItemCard: {
    marginBottom: spacing.sm,
    padding: spacing.md,
    marginHorizontal: spacing.md,
  },
  listItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItemTextContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.text,
    marginBottom: spacing.xs,
  },
  date: {
    fontSize: 13,
    color: theme.textLight,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.medium,
    minWidth: 100,
    justifyContent: 'flex-end',
  },
  statusIcon: {
    marginRight: spacing.xs,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  payButton: {
    marginTop: spacing.md,
    alignSelf: 'flex-end',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    // Add status bar height padding here too if container padding isn't enough
    paddingTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0,
  },
  emptyListContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    marginTop: spacing.xxl,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.large,
    marginRight: spacing.sm, // Slightly increased margin
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeFilter: {
    backgroundColor: theme.primary,
    borderColor: theme.background,
  },
  filterText: {
    color: theme.text,
    fontSize: 14,
  },
  activeFilterText: {
    color: theme.background,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: spacing.lg + (Platform.OS === 'android' ? 10 : 0), // Add a bit more space on Android
    right: spacing.lg,
    width: 48,
    height: 48,
    borderRadius: borderRadius.medium,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
    zIndex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  modalCard: {
    backgroundColor: theme.card,
    borderRadius: borderRadius.large,
    width: '100%',
    maxWidth: 400,
    padding: spacing.lg,
    ...shadows.medium,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    color: theme.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  modalSubtitle: {
    fontSize: 14,
    color: theme.textLight,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  paymentDetails: {
    marginVertical: spacing.md,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  paymentLabel: {
    fontSize: 14,
    color: theme.textLight,
  },
  paymentValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
  },
  paymentMethodButton: {
    marginTop: spacing.md,
  },
  closeButton: {
    padding: spacing.xs,
  },
  closeIcon: {
    color: theme.textLight,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.error + '20',
    padding: spacing.sm,
    borderRadius: borderRadius.medium,
    marginBottom: spacing.md,
  },
  errorText: {
    color: theme.error,
    fontSize: 13,
    flex: 1,
  },
});

export default PaymentScreen;
