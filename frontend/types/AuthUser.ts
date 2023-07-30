import { Api } from "./Api";

export type User = {
    id: number;
    name: string;
    email: string;
    jwt: string;
}

export type AuthUser = Api & {
    user: User;
    access: string;
}

export type Account = {
    can_authenticate: boolean,
    user: {
        id: number;
        name: string;
        email: string;
        password: string;
    }

}


export type ApiPropsGetAccounts = {
    accounts: Account[]
}