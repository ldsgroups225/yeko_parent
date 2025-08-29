import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";

// Components
import { CsCard, CsText, CsButton, CsTextField } from "@/components";

// Hooks
import { useTheme, useThemedStyles } from "@/hooks";
import { useAppSelector } from "@/store";

// Redux
import { setUser } from "@/store/appSlice";

// Services
import { auth } from "@/services/appService";

// Utils
import { normalizeCIPhoneNumber } from "@/utils/phoneUtils";

// Helpers
import { showToast } from "@/helpers/toast/showToast";

// Types
import { ITheme } from "@/styles";
import { ToastColorEnum } from "@/components/ToastMessage/ToastColorEnum";

// Styles
import { spacing } from "@/styles";
import borderRadius from "@/styles/borderRadius";

const EditProfileModal: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const themedStyles = useThemedStyles<typeof styles>(styles);
  const user = useAppSelector((s) => s?.AppReducer?.user);

  const [editLoading, setEditLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  });

  useEffect(() => {
    if (user) {
      setEditForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user?.id || !editForm.firstName.trim() || !editForm.lastName.trim() || !editForm.phone.trim()) {
      showToast("Veuillez remplir tous les champs", ToastColorEnum.Error, 7000);
      return;
    }

    const isSameFirstName = editForm.firstName === user.firstName
    const isSameLastName = editForm.lastName === user.lastName
    const isSamePhone = editForm.phone === user.phone

    // return if any is dirty
    if (isSameFirstName && isSameLastName && isSamePhone) {
      router.back()
    }

    const normalizedPhone = normalizeCIPhoneNumber(editForm.phone);
    if (!normalizedPhone) {
      showToast("Numéro de téléphone invalide", ToastColorEnum.Error, 7000);
      return;
    }

    setEditLoading(true);
    try {
      // Update user profile using auth service directly
      await auth.updateUserProfile(user.id, {
        firstName: editForm.firstName.trim(),
        lastName: editForm.lastName.trim(),
        phone: normalizedPhone
      });

      // If phone number changed, relink to students
      if (!isSamePhone) {
        const linkedCount = await auth.linkParentToStudentsByPhone(user.id, normalizedPhone);
        if (linkedCount > 0) {
          showToast(`Profil mis à jour et relié à ${linkedCount} étudiant(s)`, ToastColorEnum.Success);
        } else {
          showToast("Profil mis à jour avec succès", ToastColorEnum.Success);
        }
      } else {
        showToast("Profil mis à jour avec succès", ToastColorEnum.Success);
      }

      // Update Redux store with new user data
      const updatedUser = {
        ...user,
        firstName: editForm.firstName.trim(),
        lastName: editForm.lastName.trim(),
        phone: normalizedPhone
      };
      dispatch(setUser(updatedUser));

      // Navigate back to profile
      router.back();
    } catch (error) {
      console.error({ error });
      showToast("Erreur lors de la mise à jour du profil", ToastColorEnum.Error, 7000);
    } finally {
      setEditLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={themedStyles.container}>
      <CsCard style={themedStyles.modalContent}>
        <CsText style={themedStyles.modalTitle}>Modifier le profil</CsText>

        <View style={themedStyles.inputContainer}>
          <CsTextField
            label="Prénom"
            value={editForm.firstName}
            onChangeText={(text) => setEditForm(prev => ({ ...prev, firstName: text }))}
            placeholder="Entrez votre prénom"
          />
        </View>

        <View style={themedStyles.inputContainer}>
          <CsTextField
            label="Nom"
            value={editForm.lastName}
            onChangeText={(text) => setEditForm(prev => ({ ...prev, lastName: text }))}
            placeholder="Entrez votre nom"
          />
        </View>

        <View style={themedStyles.inputContainer}>
          <CsTextField
            label="Téléphone"
            value={editForm.phone}
            onChangeText={(text) => setEditForm(prev => ({ ...prev, phone: text }))}
            placeholder="Ex: 0701020304"
            keyboardType="phone-pad"
          />
        </View>

        <View style={themedStyles.modalButtons}>
          <CsButton
            title="Annuler"
            onPress={handleCancel}
            variant="secondary"
            style={themedStyles.modalButton}
            disabled={editLoading}
          />
          <CsButton
            title="Sauvegarder"
            onPress={handleSaveProfile}
            variant="primary"
            style={themedStyles.modalButton}
            loading={editLoading}
            disabled={editLoading}
          />
        </View>
      </CsCard>
    </View>
  );
};

// Styles
const styles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    modalContent: {
      backgroundColor: theme.background,
      borderRadius: borderRadius.large,
      padding: spacing.lg,
      width: '100%',
      maxWidth: 400,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: spacing.lg,
      textAlign: 'center',
    },
    inputContainer: {
      marginBottom: spacing.md,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.lg,
      gap: spacing.md,
    },
    modalButton: {
      flex: 1,
    },
  });

export default EditProfileModal;
