      *-----------------------------------------------------------------
      * Endpoint proposto para login por biometria/dispositivo.
      *
      * Como encaixar no SERVICEAPP principal:
      * 1. Adicionar as estruturas ws-login-biometria-in/resp na WORKING-STORAGE.
      * 2. Adicionar servico-login-biometria junto aos demais ENTRY.
      * 3. Adicionar o paragraph login-biometria antes de verificar-senha.
      *
      * Fluxo esperado pelo app:
      * GET (WS_LOGIN_BIOMETRIA)?deviceId=<deviceId>&codcli=<codigoCliente>
      *
      * A biometria continua sendo validada localmente no app. Este endpoint
      * apenas confirma se o dispositivo esta vinculado ao cliente e gera um
      * novo token de sessao.
      *-----------------------------------------------------------------

      * WORKING-STORAGE SECTION.
       01  ws-login-biometria-in identified by "data".
           03 identified by "deviceId".
             05 app-bio-device-in          pic x any length.
           03 identified by "codcli".
             05 app-bio-codcli-in          pic 9(10).

       01  ws-login-biometria-resp identified by "resposta".
           03 identified by "success" is boolean.
             05 app-bio-success-resp       pic x any length.
           03 identified by "message".
             05 app-bio-message-resp       pic x any length.
           03 identified by "token" is boolean.
             05 app-bio-token-ok-resp      pic x any length.
           03 identified by "data".
             05 identified by "token".
               07 app-bio-token-resp       pic x any length.
             05 identified by "codigoCliente".
               07 app-bio-codigo-resp      pic x any length.
             05 identified by "nomeCliente".
               07 app-bio-nome-resp        pic x any length.
             05 identified by "cpfcnpj".
               07 app-bio-cpfcnpj-resp     pic x any length.

      * PROCEDURE DIVISION - ENTRY.
      * Inserir junto aos outros servicos, apos WS_VERIFICAR_SENHA_APP.
       servico-login-biometria.
           entry "WS_LOGIN_BIOMETRIA" using comm-area.
           comm-area:>accept (ws-login-biometria-in).

           perform atribuir-headers.

           perform login-biometria thru login-biometria-ex.

           perform fechar-arquivos.

           comm-area:>displayJSON(ws-login-biometria-resp).
           goback.

      * PROCEDURE DIVISION - PARAGRAPH.
      * Inserir antes de verificar-senha.
       login-biometria.
           initialize ws-login-biometria-resp.

           if app-bio-device-in equal spaces
              or app-bio-codcli-in not greater zeros
                    move "false" to app-bio-success-resp
                    move "false" to app-bio-token-ok-resp
                    move "Dispositivo ou cliente inválido."
                                       to app-bio-message-resp
                    go login-biometria-ex.

           close sce002 s717 s017.
           open input sce002.
           if not valid-sce002
                    perform erro-estendido
                    move "false" to app-bio-success-resp
                    move "false" to app-bio-token-ok-resp
                    string
                    "Serviço Indisponível(ab-sce002-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into app-bio-message-resp
                    go login-biometria-ex.

           move app-bio-device-in to sce002-device.
           read sce002 with no lock.
           if not valid-sce002
                    move "false" to app-bio-success-resp
                    move "false" to app-bio-token-ok-resp
                    move "Dispositivo não autorizado."
                                       to app-bio-message-resp
                    go login-biometria-ex.

           move app-bio-codcli-in to aux-codcl.
           if sce002-codcl not equal aux-numcl
                    move "false" to app-bio-success-resp
                    move "false" to app-bio-token-ok-resp
                    move "Dispositivo não vinculado ao cliente."
                                       to app-bio-message-resp
                    go login-biometria-ex.

           open i-o s717.
           if not valid-s717
                    perform erro-estendido
                    move "false" to app-bio-success-resp
                    move "false" to app-bio-token-ok-resp
                    string
                    "Serviço Indisponível(ab-s717-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into app-bio-message-resp
                    go login-biometria-ex.

           move aux-numcl to 7171codcl.
           read s717 with no lock.
           if not valid-s717
                    move "false" to app-bio-success-resp
                    move "false" to app-bio-token-ok-resp
                    move "Cliente não localizado."
                                       to app-bio-message-resp
                    go login-biometria-ex.

           open input s017.
           if not valid-s017
                    perform erro-estendido
                    move "false" to app-bio-success-resp
                    move "false" to app-bio-token-ok-resp
                    string
                    "Serviço Indisponível(ab-s017-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into app-bio-message-resp
                    go login-biometria-ex.

           move 7171codcl to 0171codcl.
           read s017 with no lock.
           if not valid-s017
                    move "false" to app-bio-success-resp
                    move "false" to app-bio-token-ok-resp
                    move "Cliente não localizado."
                                       to app-bio-message-resp
                    go login-biometria-ex.

           copy "cdatahj".
           move aux-time1 to aux-t1.
           move hj-dia to aux-t2(3:2).
           move hj-mes to aux-t2(1:2).
           move hj-ano to aux-t2(5:4).
           move 7171codcl to aux-t3.
           move aux-hora to aux-t4(1:2).
           move hj-dia to aux-t4(3:2).
           move aux-min to aux-t4(5:2).
           move hj-mes to aux-t4(7:2).
           move hoje-data to 7171ultace.
           move aux-token to 7171token app-bio-token-resp.
           rewrite 7171cadas.

           string 7171codcl 0171digcl into aux-codcli.
           move aux-codcli to app-bio-codigo-resp.
           move function trim(0172nomcl) to app-bio-nome-resp.
           move function trim(7171cpfcnpj) to app-bio-cpfcnpj-resp.

           move "true" to app-bio-success-resp.
           move "true" to app-bio-token-ok-resp.
           move "OK" to app-bio-message-resp.

       login-biometria-ex.
           exit.
