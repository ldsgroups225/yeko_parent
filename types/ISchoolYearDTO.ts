export interface ISchoolYear {
  id: number
  name: string | null
}

export interface ISemester {
  id: number
  name: string
  isCurrent: boolean
}
