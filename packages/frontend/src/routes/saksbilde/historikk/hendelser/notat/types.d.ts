export type State = {
    errors: { [key: string]: string | undefined };
    hasErrors: boolean;
    isFetching: boolean;
    showAddDialog: boolean;
    expanded: boolean;
};

type ErrorAction = {
    type: 'ErrorAction';
    id: string;
    message?: string;
};

type FetchSuccessAction = {
    type: 'FetchSuccessAction';
};

type FetchAction = {
    type: 'FetchAction';
};

type ToggleDialogAction = {
    type: 'ToggleDialogAction';
    value: boolean;
};

type ToggleNotat = {
    type: 'ToggleNotat';
    value: boolean;
};

export type Action = FetchAction | FetchSuccessAction | ErrorAction | ToggleDialogAction | ToggleNotat;
