export class API{
    public static readonly URL = "http://localhost:8080"
    public static readonly DELETE = "/delete"
    public static readonly HOME = "/home"
    public static readonly INFOS = "/infos"
    public static readonly ADD = "/add"
    public static readonly AUTH_USER = "/auth/user"
    public static readonly SIGNUP = "/signup"
    public static readonly LOGIN = "/login"
    public static readonly SELECTUSER = "/select/user/"
    public static readonly VERIFYTOKEN = "/verify/token"
    public static readonly PASSWORDRESET = "/password/reset"
    public static readonly VERIFYMAIL = "/verify/mail"
    public static readonly PASSWORDUPDATE = "/password/update"
    public static readonly UPDATE = "/update"
    public static readonly SELECT = "/select?id="
    public static readonly SELECTNOTIFICATION = "/select/notification"
}

export class PATH{
    public static readonly DELETE = "/delete"
    public static readonly HOME = "/home"
    public static readonly INFOS = "/infos"
    public static readonly ADD = "/add"
    public static readonly AUTH_USER = "/auth/user"
    public static readonly SIGNUP = "/signup"
    public static readonly LOGIN = "/login"
    public static readonly SELECTUSER = "/select/user/"
    public static readonly VERIFYTOKEN = "/verify/token"
    public static readonly PASSWORDRESET = "/password/reset"
    public static readonly VERIFYMAIL = "/verify/mail"
    public static readonly PASSWORDUPDATE = "/password/update"
    public static readonly VERIFY = "/verify"
    public static readonly TOP = "/"
}

export class LOCALSTORAGE{
    public static readonly LOGIN = "ログイン"
}

export class COOKIE{
    public static readonly USERID = "userId"
    public static readonly USERNAME = "userName"
}

export class REGEX{
    public static readonly MAIL = /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;
}

export class COLUMNNAMES{
    public static readonly SETTINGNAME = "セッティングネイム"
    public static readonly CARNAME = "車名"
    public static readonly COURSE = "コース"
}