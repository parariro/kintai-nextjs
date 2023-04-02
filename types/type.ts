export type WorkingTime = {
    id: number;
    // employee_numberとnameはjoinして得たemployeesテーブルの情報
    employee_number: string;
    name: string;
    begin: string;
    end: string;
}

export type WorkingTimeForBar = {
    id: number;
    // employee_numberとnameはjoinして得たemployeesテーブルの情報
    employee_number: string;
    name: string;
    begin: string;
    end: string;
    workHours: string;
    isOverWork: boolean;
}

export type WorkingTimeForEdit = {
    id: number;
    // employee_numberとnameはjoinして得たemployeesテーブルの情報
    employee_number: string;
    name: string;
    date: string;
    begin: string;
    end: string;
}

export type Employee = {
    id: number;
    employee_number: string;
    name: string;
    employment_status: string;
    section: string;
}