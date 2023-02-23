export class API{
    public static readonly URL = "http://localhost:8080"
    //本番環境のurl
    // public static readonly URL = "";
    public static readonly DELETE = "/delete"
    public static readonly HOME = "/home"
    public static readonly INFOS = "/infos"
    public static readonly ADD = "/add"
    public static readonly AUTH_USER = "/auth/user"
    public static readonly SIGNUP = "/signup"
    public static readonly LOGIN = "/login"
    public static readonly SELECTUSER = "/select/user"
    public static readonly SELECTUSERBYUSERNAME = "/select/user/username"
    public static readonly SELECTUSERBYMAIL = "/select/user/mail"
    public static readonly VERIFYTOKEN = "/verify/token"
    public static readonly PASSWORDRESET = "/password/reset"
    public static readonly VERIFYMAIL = "/verify/mail"
    public static readonly PASSWORDUPDATE = "/password/update"
    public static readonly UPDATE = "/update"
    public static readonly SELECT = "/select?id="
    public static readonly SELECTNOTIFICATION = "/select/notification"
    public static readonly SETTINGSACCOUNT = "/settings/account?userId="
    public static readonly UPDATEUSERUSERNAME = "/update/user/username"
    public static readonly SENDMAILUPDATEMAIL = "/send/mail/update/mail"
    public static readonly UPDATEMAIL = "/mail/update"
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
    public static readonly SETTINGSACCOUNT = "/settings/account"
    public static readonly TOP = "/"
    public static readonly UPDATEMAIL = "/update/mail"
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