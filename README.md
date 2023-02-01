# asslutRacing_ui
asslutRacingで、車の設定を保存するシステム UI部分

# 各種バージョン
Angularのバージョンは、14.2.4

nodeのバージョンは、16.10.0

# nodeのバージョンを管理するための環境構築

①下記コマンドでwindows11にリナックス環境を構築。そのあと再起動

`wsl --install`

②そのあと、下記を実行

`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash`

③以下のサイトから(nvm-setup.zip)をインストール

`https://github.com/coreybutler/nvm-windows/releases`

④zipを展開し、展開したexeファイルを実行し再起動

⑤nvmがインストールされたことが確認できた場合、以下コマンドを実行

`nvm install 16.10.0`

⑥最後に以下コマンド実行

`nvm use 16.10.0`

# Angular インストール手順

①以下コマンドを実行

`Angular install`

②Angular listを実行し、以下が表示されたら成功

@angular-devkit/architect       0.1402.4

@angular-devkit/build-angular   14.2.4

@angular-devkit/core            14.2.4

@angular-devkit/schematics      14.2.4

@angular/cdk                    14.2.3

@angular/material               14.2.3

@schematics/angular             14.2.4

rxjs                            7.5.7

typescript                      4.7.4


