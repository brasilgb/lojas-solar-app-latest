       01  ws-login-biometria-resp identified by "resposta".
           03 identified by "success" is boolean.
              05 app-bio-success-resp     pic x any length.
           03 identified by "message".
              05 app-bio-message-resp     pic x any length.
           03 identified by "data".
              05 identified by "token".
                 07 app-bio-token-resp    pic x any length.
              05 identified by "codigoCliente".
                 07 app-bio-codigoCliente-resp
                                             pic x any length.
              05 identified by "nomeCliente".
                 07 app-bio-nomeCliente-resp
                                             pic x any length.
              05 identified by "linkImagem".
                 07 app-bio-linkImagem-resp
                                             pic x any length.
