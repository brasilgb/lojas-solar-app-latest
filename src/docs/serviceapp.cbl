       PROGRAM-ID. SERVICEAPP.
       AUTHOR. felipe.simmi.
       ENVIRONMENT DIVISION.

       CONFIGURATION SECTION.
       SPECIAL-NAMES. 
      * DECIMAL-POINT IS COMMA.

       REPOSITORY.
       
           class    http-client as "com.iscobol.rts.HTTPClient"
           class    http-param as "com.iscobol.rts.HTTPData.Params"
           class    j-string-buffer    as "java.lang.StringBuffer"
       
       
           class    WEB-AREA           as 
                                       "com.iscobol.rts.HTTPHandler"
           class    HTTPRequest        as           
                    "javax.servlet.http.HttpServletRequest"                            
           class    JSystem            as           "java.lang.System"
           class    JString            as           "java.lang.String" 
           class    JStringSplit       as           "java.lang.String[]" 
           class    HtmlEmail          as
                    "org.apache.commons.mail.HtmlEmail"         
           class    EmailException     as
                    "org.apache.commons.mail.EmailException"
           class    Document           as
                                       "org.jsoup.nodes.Document"
           class    Jsoup              as           "org.jsoup.Jsoup"
           class    JFile              as           "java.io.File"
           class    ServletInputStream as           
                    "javax.servlet.ServletInputStream"
           class    BufferedReader     as           
                                       "java.io.BufferedReader"                  
           class    IOException        as          "java.io.IOException"
           class    StringBuilder      as          
                                       "java.lang.StringBuilder"
           class    json-stream        as  "com.iscobol.rts.JSONStream"
           class    byte               as           "byte[]"
           class    Base64             as           "java.util.Base64"                             
           class    FileUtils          as           
                                       "org.apache.commons.io.FileUtils"
           class    Normalizer         as           
                                       "java.text.Normalizer"
           class    Form               as           
                                       "java.text.Normalizer.Form"
           class    Pattern            as
                                       "java.util.regex.Pattern"
           class    JProperties        as         
                                       "java.util.Properties"
           class    MailAuthenticator  as           "MailAuthenticator"        
           class    Session            as           "javax.mail.Session"
           class    MimeMultipart      as
                    "javax.mail.internet.MimeMultipart"
           class    InternetAddress    as           
                    "javax.mail.internet.InternetAddress"                   
           class    MimeBodyPart       as
                    "javax.mail.internet.MimeBodyPart"                            
           class    MimeMessage        as 
                    "javax.mail.internet.MimeMessage"
           class    Transport          as           
                                       "javax.mail.Transport"                                                                                                                
           .
           
       INPUT-OUTPUT SECTION.
       FILE-CONTROL. 
           copy     "s018.sl".
           copy     "s003.sl".
           copy     "s003a.sl".
           copy     "s017.sl".
           copy     "s017e.sl".
           copy     "s078.sl".
           copy     "s078p.sl".
           copy     "s084.sl".
           copy     "s105.sl".
           copy     "s257.sl".
           copy     "s405.sl".
           copy     "sig076.sl".
           copy     "sig076e.sl".
           copy     "sig092.sl".
           copy     "sig092e.sl".
           
       select s107 assign to ne-s107
           organization is indexed
           access mode is dynamic
           record key is  1071chave
           alternate  record key is  1072chave with duplicates
           alternate  record key is  1073chave with duplicates
           alternate  record key is  1074chave
           alternate  record key is  1071regat with duplicates
           lock mode is automatic with lock on record
           file status is sta107.
           
           copy     "s207.sl".                    
           
       select s207a assign to  "a-car107"
           organization is indexed
           access mode is dynamic
           record key is  2071chavea
           alternate  record key is  2072chavea
           alternate  record key is  2073chavea
           alternate  record key is  2071regata with duplicates
           lock mode is automatic with lock on record
           file status is sta207a.

       select s207h assign to  "a-hiscar"
           organization is indexed
           access mode is dynamic
           record key is  2071chaveh
           alternate  record key is  2072chaveh
           alternate  record key is  2073chaveh
           alternate  record key is  2071regath with duplicates
           lock mode is automatic with lock on record
           file status is sta207h.

           copy     "s359.sl".
           copy     "s717.sl".
           copy     "s106.sl".
           copy     "s806.sl".
           copy     "s816.sl".
           copy     "loj001.sl".
           copy     "sce001.sl".
           copy     "sce002.sl".
           copy     "sce003.sl".
           copy     "sce004.sl".
           copy     "sce005.sl".
           copy     "sce012.sl".
           copy     "sce014.sl".
           copy     "s104.sl".

           select   s666          assign to ne-s666
                                  file status is sta666
                                  organization is indexed
                                  access is dynamic
                                  record key is 6661chave
                                  lock mode automatic
                                  with lock on record.

           select   s777          assign to ne-s777
                                  file status is sta777
                                  organization is indexed
                                  access is dynamic
                                  record key is 7771chave
                                  lock mode automatic
                                  with lock on record.

           select   s888          assign to ne-s888
                                  file status is sta888
                                  organization is indexed
                                  access is dynamic
                                  record key is 8881chave
                                  lock mode automatic
                                  with lock on record.
           
           copy "arqaux-sl" replacing      ==(arquivo)==  by aux076..

       DATA DIVISION.

       FILE SECTION.
           copy     "s018.fd".
           copy     "s003.fd".
           copy     "s003a.fd".
           copy     "s017.fd".
           copy     "s017e.fd".
           copy     "s078.fd".
           copy     "s078p.fd".
           copy     "s084.fd".
           copy     "s105.fd".
           copy     "s257.fd".
           copy     "s405.fd".
           copy     "s107.fd".
           copy     "s207.fd".
           copy     "s359.fd".
           copy     "s717.fd".
           copy     "s106.fd".
           copy     "s806.fd".
           copy     "s816.fd".
           copy     "loj001.fd".
           copy     "sce001.fd".
           copy     "sce002.fd".
           copy     "sce003.fd".
           copy     "sce004.fd".
           copy     "sce005.fd".
           copy     "sce012.fd".
           copy     "sce014.fd".
           copy     "s104.fd".
           copy     "sig076.fd".
           copy     "sig076e.fd".
           copy     "sig092.fd".
           copy     "sig092e.fd".
           
       fd s207a.

       01 2071cadasa.
          03 2071chavea.
             05 2071codfla pic 9(3).
             05 2071codcla pic 9(8).
             05 2071codcaa pic x(10).
          03 2072chavea.
             05 2072codcla pic 9(8).
             05 2072codfla pic 9(3).
             05 2072codcaa pic x(10).
          03 2073chavea.
             05 2073anoema pic 9(4).
             05 2073mesema pic 99.
             05 2073diaema pic 99.
             05 2073codfla pic 9(3).
             05 2073codcla pic 9(8).
             05 2073codcaa pic x(10).
          03 2071valcoa pic 9(9)V99 comp-3.
          03 2071valena pic 9(9)V99 comp-3.
          03 2071planoa pic 9(4) comp-3.
          03 2071presta occurs 24.
             05 2071vencia pic 9(8) comp-3.
             05 2071valora pic 9(9)V99 comp-3.
             05 2071clasia pic x.
             05 2071dadosa occurs 5.
                07 2071datrea pic 9(8) comp-3.
                07 2071valrea pic 9(9)V99 comp-3.
          03 2071situaa pic x.
      *      *>    quando letra equal VI, RE, CR e CV, estes campos
      *      *>    sao juntados e contem o numero do resumo de ope-
      *      *>    racoes dos cartoes de credito.
          03 2071datapa pic 9(8) comp-3.
          03 2071numpea pic 9(9) comp-3.
          03 2071letraa pic xx.
          03 2071itensa pic 9(7) comp-3.
          03 2071vctena pic 9(8) comp-3.
          03 2071filpoa pic x.
          03 2071vendea pic 9(4) comp-3.
          03 2071segura pic 9(6)v99.
          03 2071senlia pic x(06).
          03 filler pic x(01).
          03 2071regata pic x.
           
       fd s207h.
       01 2071cadash.
          03 2071chaveh.
             05 2071codflh pic 9(3).
             05 2071codclh pic 9(8).
             05 2071codcah pic x(10).
          03 2072chaveh.
             05 2072codclh pic 9(8).
             05 2072codflh pic 9(3).
             05 2072codcah pic x(10).
          03 2073chaveh.
             05 2073anoemh pic 9(4).
             05 2073mesemh pic 99.
             05 2073diaemh pic 99.
             05 2073codflh pic 9(3).
             05 2073codclh pic 9(8).
             05 2073codcah pic x(10).
          03 2071valcoh pic 9(9)V99 comp-3.
          03 2071valenh pic 9(9)V99 comp-3.
          03 2071planoh pic 9(4) comp-3.
          03 2071presth occurs 24.
             05 2071vencih pic 9(8) comp-3.
             05 2071valorh pic 9(9)V99 comp-3.
             05 2071clasih pic x.
             05 2071dadosh occurs 5.
                07 2071datreh pic 9(8) comp-3.
                07 2071valreh pic 9(9)V99 comp-3.
          03 2071situah pic x.
      *      *>    quando letra equal VI, RE, CR e CV, estes campos
      *      *>    sao juntados e contem o numero do resumo de ope-
      *      *>    racoes dos cartoes de credito.
          03 2071dataph pic 9(8) comp-3.
          03 2071numpeh pic 9(9) comp-3.
          03 2071letrah pic xx.
          03 2071itensh pic 9(7) comp-3.
          03 2071vctenh pic 9(8) comp-3.
          03 2071filpoh pic x.
          03 2071vendeh pic 9(4) comp-3.
          03 2071segurh pic 9(6)v99.
          03 2071senlih pic x(06).
          03 filler pic x(01).
          03 2071regath pic x.
           
           
       fd  s666.
       01  6661cadas.
           03  6661chave.
               05  6661codcl   pic 9(8).
               05  6661anove   pic 9(4).
               05  6661mesve   pic 99.
               05  6661diave   pic 99.
               05  6661codfl   pic 9(4).
               05  6661codca   pic x(10).
               05  6661numpr   pic 99.
           03  6661valor       pic 9(6)v99.
           03  6661venci       pic 9(8).

       fd  s777.
       01  7771cadas.
           03  7771chave.
               05  7771dtmvt   pic 9(8).
               05  7771seque   pic 9(4).
           03  7771evento      pic x(300).

       fd  s888.
       01  8881cadas.
           03  8881chave.
               05  8881dista   pic 9(8).
               05  8881filia   pic 9(4).                


       copy "arqaux-fd" replacing      ==(arquivo)==  by aux076.
              05    aux076-orige       pic 9(04).
              05    aux076-numnf       pic 9(10).
              05    aux076-serie       pic x(03).
              05    aux076-debcr       pic x(01).
           03       aux076-valor       pic 9(09)v99.
           
           
       WORKING-STORAGE SECTION.
       78  w78-services value "S".    
           copy "isgui.def".
           copy "iscobol.def".
           copy "iscrt.def".
           copy "isfonts.def".
           copy "isresize.def".
           copy "ismsg.def".
           copy "SQLCA".
           copy "variaveisProg".
           
           copy     "appsolar/login-app.cpy".
           copy     "appsolar/login-app-resp.cpy".
           copy     "appsolar/login-biometria.cpy".
           copy     "appsolar/login-biometria-resp.cpy".
           copy     "appsolar/verifica-senha.cpy".
           copy     "appsolar/verifica-senha-resp.cpy".
           copy     "appsolar/alterar-senha.cpy".
           copy     "appsolar/alterar-senha-resp.cpy".
           copy     "appsolar/carrocel-promocao-resp.cpy".
           copy     "appsolar/primeiro-acesso.cpy".
           copy     "appsolar/primeiro-acesso-resp.cpy".
           copy     "appsolar/carrega-uf-resp.cpy".
           copy     "appsolar/carrega-cidade.cpy".
           copy     "appsolar/carrega-cidade-resp.cpy".
           copy     "appsolar/carrega-crediario.cpy".
           copy     "appsolar/carrega-crediario-resp.cpy".
           copy     "appsolar/carrega-faq-resp.cpy".
           copy     "appsolar/protocolo-assistencia.cpy".
           copy     "appsolar/protocolo-assistencia-resp.cpy".
           copy     "appsolar/protocolo-detalhe.cpy".
           copy     "appsolar/protocolo-detalhe-resp.cpy".
           copy     "appsolar/recupera-senha.cpy".
           copy     "appsolar/recupera-senha-resp.cpy".
           copy     "appsolar/historico-compras.cpy".
           copy     "appsolar/historico-compras-resp.cpy".
           copy     "appsolar/historico-itens.cpy".
           copy     "appsolar/historico-itens-resp.cpy".
           copy     "appsolar/carrega-lojas.cpy".
           copy     "appsolar/carrega-lojas-resp.cpy".
           copy     "appsolar/lojas-proxima.cpy".
           copy     "appsolar/lojas-proxima-resp.cpy".
           copy     "appsolar/grava-device.cpy".
           copy     "appsolar/grava-device-resp.cpy".
           copy     "appsolar/pesquisa-satisfacao.cpy".
           copy     "appsolar/pesquisa-satisfacao-resp.cpy".
           copy     "appsolar/resposta-pesquisa.cpy".
           copy     "appsolar/resposta-pesquisa-resp.cpy".
           copy     "appsolar/carrega-cliente.cpy".
           copy     "appsolar/carrega-cliente-resp.cpy".
           copy     "appsolar/replica-cliente.cpy".
           copy     "appsolar/replica-cliente-resp.cpy".
           copy     "appsolar/altera-cliente.cpy".
           copy     "appsolar/altera-cliente2.cpy".
           copy     "appsolar/altera-cliente-resp.cpy".
           copy     "appsolar/altera-cliente-resp2.cpy".
           copy     "appsolar/autorizacao-cliente.cpy".
           copy     "appsolar/autorizacao-cliente-resp.cpy".
           copy     "appsolar/resposta-autorizacao.cpy".
           copy     "appsolar/resposta-autorizacao-resp.cpy".
           copy     "appsolar/ordem-pagamento-resp.cpy".
           copy     "appsolar/atualiza-ordem.cpy".
           copy     "appsolar/atualiza-ordem-resp.cpy".
           copy     "appsolar/transacao-pix.cpy".
           copy     "appsolar/transacao-pix-resp.cpy".
           copy     "appsolar/segunda-via-boleto.cpy".
           copy     "appsolar/segunda-via-boleto-resp.cpy".
           copy     "appsolar/lista-estado-civil-resp.cpy".
           copy     "appsolar/lista-escolaridade-resp.cpy".
           copy     "appsolar/lista-profissao-resp.cpy".
           copy     "appsolar/clientes-notify.cpy".
           copy     "appsolar/clientes-notify-resp.cpy".
           copy     "appsolar/versao-app-resp.cpy".
           copy     "appsolar/lista-pdv-cashback.cpy".
           copy     "appsolar/consulta-cashback.cpy".
           copy     "appsolar/consulta-cashback-resp.cpy".
           copy     "appsolar/consulta-nf-cashback.cpy".
           copy     "appsolar/consulta-nf-cashback-resp.cpy".
           copy     "appsolar/grava-cashback.cpy".
           copy     "appsolar/grava-cashback-resp.cpy".
           
           copy "pagamentos/pix.cpy".
       01  aux-urlservico pic x any length.
       copy "httpVariaveis" replacing ==(prefix)== by log-pix.
       
       copy "arqaux-wk" replacing      ==(arquivo)==  by aux076.
       
       01  wk-valor.
           03       wk-v4              pic x(3).           
           03       wk-v3              pic x(3).           
           03       wk-v2              pic x.           
           03       wk-v1              pic x(2).           
           
       01  banco-pix                   pic 9(04).
       01  service-name-pagamentos     pic x any length.       
       01  aux-numnf                   pic 9(10).           
           
       01  ext-local                   pic x(01).
           
       77  stat-loj001                 pic X(2).
           88 Valid-loj001             value "00" THRU "09".
       77  stat-sce001                 pic X(2).
           88 Valid-sce001             value "00" THRU "09".
       77  stat-sce002                 pic X(2).
           88 Valid-sce002             value "00" THRU "09".
       77  stat-sce003                 pic X(2).
           88 Valid-sce003             value "00" THRU "09".
       77  stat-sce004                 pic X(2).
           88 Valid-sce004             value "00" THRU "09".
       77  stat-sce005                 pic X(2).
           88 Valid-sce005             value "00" THRU "09".
       77  stat-sce012                 pic X(2).
           88 Valid-sce012             value "00" THRU "09".
       77  stat-sce014                 pic X(2).
           88 Valid-sce014             value "00" THRU "09".
       77  sta666                      pic X(2).
           88 Valid-s666               value "00" THRU "09".
       77  sta888                      pic X(2).
           88 Valid-s888               value "00" THRU "09".
       77  sta777                      pic X(2).
           88 Valid-s777               value "00" THRU "09".
       77  sta017                      pic X(2).
           88 Valid-s017               value "00" THRU "09".
       77  sta017e                     pic X(2).
           88 Valid-s017e              value "00" THRU "09".
       77  sta359                      pic X(2).
           88 Valid-s359               value "00" THRU "09".
       77  sta105                      pic X(2).
           88 Valid-s105               value "00" THRU "09".
       77  sta405                      pic X(2).
           88 Valid-s405               value "00" THRU "09".
       77  sta107                      pic X(2).
           88 Valid-s107               value "00" THRU "09".
       77  stat-s257                   pic X(2).
           88 Valid-s257               value "00" THRU "09".
       77  sta207                      pic X(2).
           88 Valid-s207               value "00" THRU "09".
       77  sta207a                     pic X(2).
           88 Valid-s207a              value "00" THRU "09".
       77  sta207h                     pic X(2).
           88 Valid-s207h              value "00" THRU "09".
       77  stat-s717                   pic X(2).
           88 Valid-s717               value "00" THRU "09".
       77  sta003                      pic X(2).
           88 Valid-s003               value "00" THRU "09".
       77  sta003a                     pic X(2).
           88 Valid-s003a              value "00" THRU "09".
       77  sta018                      pic X(2).
           88 Valid-s018               value "00" THRU "09".
       77  stat-s078                   pic X(2).
           88 Valid-s078               value "00" THRU "09".
       77  stat-s078p                  pic X(2).
           88 Valid-s078p              value "00" THRU "09".
       77  stat-s084                   pic X(2).
           88 Valid-s084               value "00" THRU "09".
       77  stat-s106                   pic X(2).
           88 Valid-s106               value "00" THRU "09".
       77  stat-s806                   pic X(2).
           88 Valid-s806               value "00" THRU "09".
       77  stat-s816                   pic X(2).
           88 Valid-s816               value "00" THRU "09".
       77  sta104                      pic X(2).
           88 Valid-s104               value "00" THRU "09".
       77  stat-sig076                 pic X(2).
           88 Valid-sig076             value "00" THRU "09".
       77  stat-sig076e                 pic X(2).
           88 Valid-sig076e             value "00" THRU "09".
       77  stat-sig092                 pic X(2).
           88 Valid-sig092             value "00" THRU "09".
       77  stat-sig092e                pic X(2).
           88 Valid-sig092e            value "00" THRU "09".
           
           
           01 sessao identified by "sessao".
              03 filler identified by "status".
                 05 ok-status          pic x any length value "OK".
              03 filler identified by "message".
                 05 ok-message         pic x any length.

           77 ed-valor                 pic zzzzz9.99.
           77 aux-versao               pic 9(03) value zeros.
           77 aux-ver-android          pic 9(03) value zeros.
           77 aux-ver-ios              pic 9(03) value zeros.
           77 par                      pic 999  value zeros.
           77 servlet-req              object reference HTTPRequest.
           77 serv-input-stream        object reference 
                                                    ServletInputStream.
           77 reader                   object reference BufferedReader.
           77 sb                       object reference StringBuilder.
           77 linha                    object reference JString.
           77 doc                      object reference JString.
           77 buff                     object reference byte. 
           77 decodeBytes              object reference byte.
           77 stringBase64             object reference JString.
           77 split                    object reference JStringSplit.
           77 imagemFile               object reference JString.
           01 aux-seq                  pic 99.
           01 aux-dat                  pic 9(8).
           01 aux-image-file           pic x any length.
           01 aux-codclnum             pic zzzzzzz.
           01 aux-codclinum            pic x any length.
           01 aux-doc                  pic x any length.
           
           01       prop               object reference JProperties.
           01       autenticador       object reference 
                                                    MailAuthenticator.
           01       objSession         object reference Session.
           01       mbp                object reference MimeBodyPart.
           01       mp                 object reference MimeMultipart.
           01       mensagem           object reference MimeMessage.
           01       enderecoDe         object reference InternetAddress.
           01       enderecoPara       object reference InternetAddress.      
           
           77 len                      pic s9(6).
           77 my-stream                object reference json-stream.
           77 stringStream             object reference JString.
           77 aux-count                pic 9(3).
           77 w-p                      pic 99 value zeros.
           77 i-existe                 pic 9 value zeros.
           77 i-ord                    pic 9 value zeros.
           77 i-esp                    pic 9 value zeros.
           77 aux-urlboleto            pic x(300) value spaces.
       01  aux-perjur pic s9(03)v99.
       01  i-juresp pic 9.
       01  JUR-FOLHA external pic X.
       01  jur-juresp external pic 9.
       01  jur-capital external pic s9(09)v99.
       01  jur-taxa external pic s9(03)v99.
       01  jur-tempo external pic 9(06).
       01  jur-juros external pic s9(09)v99.
       01  jur-montante pic s9(09)v99.
       01  jur-perce pic s9(3)v9(6).
       01  jur-multa external pic s9(09)v99.
       
           01  aux1043anoem            pic 9(4).
           01  aux1043mesem            pic 99.
           01  aux1042numpe            pic 9(9).
           01  aux1041filia            pic 9(3).
           01  aux1045datem            pic 9(9). 
           01  aux1041total            pic 9(9)v99.
           01  aux1041codcl            pic 9(8).
           01  aux-cash-debtotal       pic 9(9)v99.
           01  aux-cash-credtotal       pic 9(9)v99.
           01  aux-select              pic x any length.
           
           
       01  imagens-in identified by "data".
             03 identified by "token".
               05 app-imagens-token-in              pic x any length.
             03 identified by "selfCliente".
               05 app-selfCliente-in                pic x any length.          
             03 identified by "Documento".
               05 app-imaDocumento-in               pic x any length.      
             03 identified by "Assinatura".
               05 app-imaAssinatura-in              pic x any length.         
             03 identified by "Endereco".
               05 app-imaEndereco-in                pic x any length.          
             03 identified by "Renda".
               05 app-imaRenda-in                   pic x any length.       

       01  imagens-out identified by "resposta".
           03 identified by "success" is boolean.
             05 app-ima-success-resp             pic x any length.
           03 identified by "message".
             05 app-ima-message-resp             pic x any length.
           03 identified by "token" is boolean.
             05 app-ima-token-resp               pic x any length.

       01  ws-cadastro-cliente-in identified by "data". 
           03 identified by "token".
             05 app-cad-token-in               pic x(50).
           03 identified by "nomeCliente".
             05 app-cad-nome-in                pic x(40). 
           03 identified by "enderecoCliente".
             05 app-cad-endereco-in            pic x(40).
           03 identified by "cepCliente".
             05 app-cad-cep-in                 pic 9(08).
           03 identified by "cidadeCliente".
             05 app-cad-cidade-in              pic x(30).
           03 identified by "ufCliente".
             05 app-cad-uf-in                  pic x(02).
           03 identified by "celularCliente".
             05 app-cad-celular-in             pic x any length.
           03 identified by "emailCliente".
             05 app-cad-email-in               pic x(100).
           03 identified by "nascimentoCliente".
             05 app-cad-dtnasc-in              pic 9(08).
             
       01  ws-cadastro-cliente-resp identified by "resposta". 
           03 identified by "success" is boolean.
             05 app-cad-success-resp        pic x any length.
           03 identified by "message".
             05 app-cad-message-resp        pic x any length.
           03 identified by "token"   is boolean.
             05 app-cad-token-resp              pic x any length.

       01  parcelas identified by "data".
             03 identified by "token".
               05 app-ord-pagamento-token-in        pic x any length.
             03 identified by "valor".
               05 app-ord-valor-in                  pic x any length.          
             03 identified by "parcela" occurs dynamic 
                                                 capacity par-num.
              05 identified by "numeroCarne".
                 07 app-ord-numeroCarne-r           pic x(10).
              05 identified by "filial".
                 07 app-ord-filial-r                pic 9(03).
              05 identified by "parcela".
                 07 app-ord-parcela-r               pic 9(02).
              05 identified by "vlprest".
                 07 app-ord-vlprest-r               pic 9(09)v99.
              05 identified by "acrescimo".
                 07 app-ord-acrescimo-r             pic 9(09)v99.
             03 identified by "tipoPagamento".
               05 app-ord-tppgt-in                  pic 9.          
             03 identified by "validaDados".
               05 app-ord-vdados-in                 pic x.          
             03 identified by "dadosCartao".
               05 identified by "numeroCartao".
                 07 app-ord-numcartao-in            pic x any length.          
               05 identified by "nomeCartao".
                 07 app-ord-nomcartao-in            pic x any length.          
               05 identified by "validadeCartao".
                 07 app-ord-valCartao-in            pic x any length.          
               05 identified by "cvvCartao".
                 07 app-ord-cvvCartao-in            pic x any length.          
      
       01  aux-caminho                 pic x any length. 

       01  dados-do-cartao.
           03  aux-numcartao           pic x(16).
           03  aux-nomcartao           pic x(50).
           03  aux-valcartao           pic x(07).
           03  aux-cvvcartao           pic x(06).
      
       01  dat-validade                pic 9(06).
       01  dat-validade-r              redefines    dat-validade.
           03 val-m1                   pic 9(02).
           03 val-aa.
              05 val-a1                pic 99.
              05 val-a2                pic 99.

       01  data-ref1                   pic 9(06).
       01  data-ref1-r                 redefines    data-ref1.
           03 ref-ano1                 pic 9(4).
           03 ref-mes1                 pic 9(2).
                                                  
       01  data-ref2                   pic 9(06).
       01  data-ref2-r                 redefines    data-ref2.
           03 ref-ano2                 pic 9(4).
           03 ref-mes2                 pic 9(2).
           
       01  ed-datval                   pic 99/9999.           
       01  calc-date                   pic 9(08).           
           
       01  push-title-ext              pic x(100)  external.
       01  push-texto-ext              pic x(1000) external.
       01  push-type-ext               pic 9       external.
       01  push-token-ext              pic x(300)  external.
           
       01  dci-where-constraint        external pic x(4095).
       01  aux-caminho-xml             pic x any length.
       01  aux-origem                  pic x any length.
       01  doc-cred                    pic x any length.
                 
      *     01 i            pic 9999 value zeros.
           01 j            pic 9999 value zeros.
           01 l            pic 9999 value zeros.
           01 i-fil        pic 9   value zeros.
           01 valido external pic x(03).
           01 tipocgcpf external pic x(01).
           01 numcpfj external pic 9(14).
           01 w-cgcpf.
              03 w-c occurs 18 pic x.
           01 wk-cgcpf pic 9(14).
           01 wk-cgcpf-r redefines wk-cgcpf.
              03 wk-c occurs 14 pic 9.
           77 aux-codigo-disp          pic 9(7).
           77 aux-digito-disp          pic 9.
           77 aux-codmun               pic 9(7) value zeros.
           01 aux-codcl                pic 9(10).
           01 aux-codcl-r              redefines    aux-codcl.
                    03 aux-numcl       pic 9(09).
                    03 aux-digcl       pic 9.
           01  PARAM-QTDIA.
                    03 DTINI           pic 9(08).
                    03 DTFIN           pic 9(08).
                    03 QTDIA           pic S9(05) comp-3.
           01       totre              pic s9(09)v99 value zeros.   
           01       valnc              pic s9(09)v99 value zeros.   
           01       acres              pic s9(09)v99 value zeros.   
           01       wdias              pic 9(04) value zeros.   
           01       atraso             pic 9(04) value zeros.  
           01       percentual         pic s9(03)v99 value zeros.
           01       aux-parcelamento.
                    03 aux-numpar      pic 99.
                    03 aux-barra       pic x.
                    03 aux-plano       pic 99.
           01 T1-Gd-3-Record.
                    03 COL-CARNE       pic x(10).
                    03 COL-FILIA       pic zzz9.
                    03 COL-PARCELA     pic X(08).
                    03 COL-VENCIMENTO  pic 99/99/9999.
                    03 COL-ATRASO      pic zzz9.
                    03 COL-VLPREST     pic zzzzzzzz9.99.
                    03 COL-ACRESC      pic zzzzzzzz9.99.
                    03 COL-TOTAL       pic zzzzzzzz9.99.
       01  ne-s666                     pic x(100) value spaces.                                                
       01  ne-s777                     pic x(100) value spaces.                                                
       01  aux-valor                   pic s9(09)v99 value zeros.           
       01  ac-total                    pic s9(09)v99 value zeros.           
       01  ed-proto                    pic zzzzzzzzz9.
       01  aux-dtdev                   pic 9(08) value zeros.
       01  co-categoria                pic 99 value zeros.
       01  xcategoria                  pic x(20) value spaces.
       01  aux-venci                   pic 9(08) value zeros.
       01  ed-numnf                    pic zzzzzzzz9.
       01  ed-filial                   pic zz9.
       01  ed-total                    pic zzzzzzzzz9.99.                    
       01  ed-unitario                 pic zzzzzzzzz9.9999.
       01  ed-itens                    pic zzzzzzzz9.
       01  ed-quant                    pic zzzzzzz9.9999.  
       
       01  ed-latlon                   pic -9.99999999999.                  

       01  aux-latitude                pic s9(2)v9(11).
       01  aux-longitude               pic s9(2)v9(11).
       01  aux-nome-fil                pic x(20) value spaces.
       01  aux-nome-ven                pic x(30) value spaces.
       01  ed-data                     pic 99/99/9999.

       01  AUX-TX-AJUSTADA             PIC S9(03)V99 VALUE ZEROS.
       01  i-sce012                    pic 9 value zeros.
       01  aux-lat1                    pic s9(03)v9(11).
       01  aux-lat2                    pic s9(03)v9(11).
       01  aux-lon1                    pic s9(03)v9(11).
       01  aux-lon2                    pic s9(03)v9(11).
       01  aux-distancia               pic s9(09)v999.
       01  aux-reslat                  pic s9(03)v9(11).
       01  aux-reslon                  pic s9(03)v9(11).
       01  aux-metlat                  pic s9(18)v999.
       01  aux-metlon                  pic s9(18)v999.
       01  aux-raiz                    pic s9(18)v9(11).
       01  aux-numer                   pic x(10) value spaces.  
       01  aux-qtd                     pic 9(03) value zeros.
       01  ac-conta                    pic 9(02) value zeros.
       01  aux-numord                  pic 9(08) value zeros.
       01  ord-valor                   pic 9(09)v99 value zeros.
       01  alf-valor.
           03  ed-valord               pic zzzzzzzz9.99.
       
       01  wk-distancia                pic 9(9)v999.
       01  wk-dist-r                   redefines    wk-distancia.
           03 wk-km                    pic 9(9).
           03 wk-resto                 pic 999.   
           
       01  aux-km                      pic zzz9.                 
       01  filler   pic 9(01).
           88 cliente-existe           value 1 false 0.      

       01  TABELA-FILIAIS.
           03 TB-FIL                   PIC 9(07) OCCURS 999 TIMES.
       
       01 ws-dados.
           03 ws-d           PIC  x
                      OCCURS 100 TIMES.
       01 wk-dados.
           03 wk-d           PIC  x
                      OCCURS 100 TIMES.
                      
       01  aux-banco                   pic 9(3) value zeros.                      
       
              
       
       01  aux-token.
           03       aux-t1             pic 9(08).
           03       aux-t2             pic 9(08).
           03       aux-t3             pic 9(07).
           03       aux-t4             pic 9(08).

       01  tab-senha                   pic x(40) value
           "abcdefghiABCDEFGHI123456789jlmNOPqRstUVX".
       01  t-senha                     redefines  tab-senha.
           03  tsenha                  pic X occurs 40 times.

       01  aux-numero-senha            pic 9(08) value zeros.
       01  idx                         pic 99 value zeros.
       01  rec-senha                   pic x(08) value spaces.
       01  url-senha                   pic x any length value 
           "https://portal.gruposolar.com.br/portal-senhas/alterar-senha
      -    "?token=".
           
       01  aux-url-senha               pic x any length.
       
       
       01  idx2                        pic 9(05) value zeros.
       01  tab-email.
           03 tb-email                 pic x occurs 100 times.
       01  rec-email                   pic x(100) value spaces.    

       01  email                       object reference HtmlEmail.
       01  conteudoEmailString         object reference JString.
       01  wrk-throwable               pic x any length.
       01  conteudoEmail               pic x any length.
       01  wkr-msg-email               pic x any length.
       01  arq_html                    object reference JFile.
       01  doc_html                    object reference Document.  
       01  aux-codcli                  pic x any length.
       
       01  aux-string                  object reference JString.
       01  normalized                  object reference JString.
       01  patternObj                  object reference Pattern.
       
       LINKAGE SECTION.
           01  comm-area object reference web-area.

       PROCEDURE DIVISION USING comm-area.

       MAIN.

           accept   ext-local          from
                                       environment "ext_local".
           accept   ext-banco-principal from 
                                       environment "banco_principal".
           accept   ext-banco-username from 
                                       environment "banco_username".
           accept   ext-banco-password from         
                                       environment "banco_password".                          
           accept   aux-caminho-xml    from
                                       environment "caminho_xml".
           accept   aux-origem         from
                                       environment "app_origem".                                       
           accept   doc-cred           from
                                       environment "doc_cred".                                       
           accept   aux-banco          from
                                       environment "banco_pix".                                       
           accept   aux-ver-android    from
                                       environment "versao_android".                                       
           accept   aux-ver-ios        from
                                       environment "versao_ios".                                       

    	     set environment "file.index" to "dcic"
           call "DCI_SETENV"  using  "DCI_DATABASE" ext-banco-principal.
           call "DCI_SETENV"  using  "DCI_LOGIN"    ext-banco-username.
           call "DCI_SETENV"  using  "DCI_PASSWD"   ext-banco-password.                                   
           call "DCI_SETENV"  using    "DCI_XFDPATH"  aux-caminho-xml.
           
           move     zeros              to           jur-juresp
                                                    jur-taxa.
           
           
           
           set environment "file.index" to "jisam"
          
           perform  atribuir-headers.                            
           move "Programa carregado com sucesso" 
                                       to             ok-message. 
           
           comm-area:>displayJSON (sessao). 
           goback.
       
       atribuir-headers.
           comm-area:>addOutHeader("Content-Type", "application/json")
           comm-area:>addOutHeader(
                    "Access-Control-Allow-Origin", aux-origem).
           comm-area:>addOutHeader(
                    "Access-Control-Allow-Credentials", "true"). 
           comm-area:>addOutHeader("Content-Type", 
                    "application/json; charset=utf-8").
                                
         
      *-----------------------------------------------------------------
       servico-versao-app.
           entry "WS_VERSAO_APP"       using        comm-area.
           perform  atribuir-headers.
           accept   aux-ver-android    from
                                       environment "versao_android".                                       
           accept   aux-ver-ios        from
                                       environment "versao_ios".
           move     "true"             to       app-versao-success-resp
           move     aux-ver-ios        to       app-versao-ios-resp.                                                           
           move     aux-ver-android    to       app-versao-android-resp.                                                                   
           perform  fechar-arquivos.
           comm-area:>displayJSON(ws-versao-app-resp).
           goback.
      *-----------------------------------------------------------------
       servico-login-app.
           entry "WS_LOGIN_APP"        using        comm-area.
           comm-area:>accept (ws-login-app-in). 
           
           perform  atribuir-headers.
           
           perform  login-app          thru         login-app-ex.  

           perform  fechar-arquivos.
           
           comm-area:>displayJSON(ws-app-login-resp).
           goback.
      *-----------------------------------------------------------------
       servico-verificar-senha.
           entry "WS_VERIFICAR_SENHA_APP"  using      comm-area.
           comm-area:>accept (ws-verificar-senha-in). 
           
           perform  atribuir-headers.
           
           perform  verificar-senha.  

           perform  fechar-arquivos.
           
           comm-area:>displayJSON(ws-verificar-senha-resp).
           goback.

      *-----------------------------------------------------------------
       servico-login-biometria.    
           entry "WS_LOGIN_BIOMETRIA_APP"  using      comm-area.
           comm-area:>accept (ws-login-biometria-in). 
           
           perform  atribuir-headers.
           
           perform  login-biometria.  

           perform  fechar-arquivos.
           
           comm-area:>displayJSON(ws-login-biometria-resp).
           goback.
      *-----------------------------------------------------------------
       servico-alterar-senha.
           entry "WS_ALTERAR_SENHA_APP"  using      comm-area.
           comm-area:>accept (ws-alterar-senha-in). 
           
           perform  atribuir-headers.
           
           perform  alterar-senha      thru         asenha-ex.  

           perform  fechar-arquivos.
           
           comm-area:>displayJSON(ws-alterar-senha-resp).
           goback.
      *-----------------------------------------------------------------
       servico-carrocel-promocao.
           entry "WS_CARROCEL_PROMOCAO" using      comm-area.
           
           perform  carrocel-promocao  thru        carrocel-promocao-ex.  

           perform  fechar-arquivos.
           comm-area:>addOutHeader("Content-Type", 
                                      "application/json; charset=utf-8")
           
           comm-area:>displayJSON(ws-carrocel-promocao-resp).
           goback.
      *-----------------------------------------------------------------     
       servico-primeiro-acesso.
           entry "WS_PRIMEIRO_ACESSO"  using      comm-area.
           comm-area:>accept (ws-primeiro-acesso-in). 
           
           perform  primeiro-acesso    thru        primeiro-acesso-ex.  

           perform  fechar-arquivos.
           comm-area:>addOutHeader("Content-Type", 
                                      "application/json; charset=utf-8")
           
           comm-area:>displayJSON(ws-primeiro-acesso-resp).
           goback.
      *-----------------------------------------------------------------     
       servico-carrega-uf.
           entry "WS_CARREGA_UF" using      comm-area.
   
           perform  carrega-uf         thru        carrega-uf-ex.  

           perform  fechar-arquivos.
           comm-area:>addOutHeader("Content-Type", 
                                      "application/json; charset=utf-8")
           
           comm-area:>displayJSON(ws-carrega-uf-resp).
           goback.
      *-----------------------------------------------------------------     
       servico-carrega-cidade.
           entry "WS_CARREGA_CIDADE"  using      comm-area.
           comm-area:>accept (ws-carrega-cidade-in). 
           
           perform  carrega-cidade     thru        carrega-cidade-ex.  

           perform  fechar-arquivos.
           comm-area:>addOutHeader("Content-Type", 
                                      "application/json; charset=utf-8")
           
           comm-area:>displayJSON(ws-carrega-cidade-resp).
           goback.
      *-----------------------------------------------------------------     
       servico-carrega-crediario.
           entry "WS_CARREGA_CREDIARIO"  using      comm-area.
           comm-area:>accept (ws-carrega-crediarioa-in). 
           
           perform  atribuir-headers. 
           perform  carrega-crediario  thru        carrega-crediario-ex.  

           perform  fechar-arquivos.
          
           comm-area:>displayJSON(ws-carrega-crediario-resp).
           goback.
      *-----------------------------------------------------------------     
       servico-protocolo-assistencia.
           entry "WS_PROTOCOLO_ASSISTENCIA"  using      comm-area.
           comm-area:>accept (ws-protocolo-assistencia-in). 
           
           perform  protocolo-assistencia  
                                       thru    protocolo-assistencia-ex.  

           perform  fechar-arquivos.
           comm-area:>addOutHeader("Content-Type", 
                                      "application/json; charset=utf-8")
           
           comm-area:>displayJSON(ws-protocolo-assistencia-resp).
           goback.
      *-----------------------------------------------------------------     
       servico-protocolo-detalhe.
           entry "WS_PROTOCOLO_DETALHE"  using      comm-area.
           comm-area:>accept (ws-protocolo-detalhe-in). 
           
           perform  protocolo-detalhe  
                                       thru    protocolo-detalhe-ex.  

           perform  fechar-arquivos.
           comm-area:>addOutHeader("Content-Type", 
                                      "application/json; charset=utf-8")
           
           comm-area:>displayJSON(ws-protocolo-detalhe-resp).
           goback.
      *-----------------------------------------------------------------     
       servico-carrega-faq.
           entry "WS_CARREGA_FAQ"  using      comm-area.
           
           perform  carrega-faq        thru    carrega-faq-ex.  

           perform  fechar-arquivos.
           comm-area:>addOutHeader("Content-Type", 
                                      "application/json; charset=utf-8")
           
           comm-area:>displayJSON(ws-carrega-faq-resp).
           goback.
      *-----------------------------------------------------------------     
       servico-recupera-senha.
           entry "WS_RECUPERA-SENHA"  using      comm-area.
           comm-area:>accept (ws-recupera-senha-in). 
           
           perform  atribuir-headers. 
           
           perform  recupera-senha     thru    recupera-senha-ex.  

           perform  fechar-arquivos.
           comm-area:>addOutHeader("Content-Type", 
                                      "application/json; charset=utf-8")
           
           comm-area:>displayJSON(ws-recupera-senha-resp).
           goback.
      *-----------------------------------------------------------------     
       servico-historio-compras.
           entry "WS_HISTORICO_COMPRAS" using      comm-area.
           comm-area:>accept (ws-historico-compras-in). 
           
           perform  historico-compras  thru    historico-compras-ex.  

           perform  fechar-arquivos.
           comm-area:>addOutHeader("Content-Type", 
                                      "application/json; charset=utf-8")
           
           comm-area:>displayJSON(ws-historico-compras-resp).
           goback.
      *-----------------------------------------------------------------     
       servico-historio-itens.
           entry "WS_HISTORICO_ITENS" using      comm-area.
           comm-area:>accept (ws-historico-itens-in). 
           
           perform  historico-itens thru    historico-itens-ex.  

           perform  fechar-arquivos.
           comm-area:>addOutHeader("Content-Type", 
                                      "application/json; charset=utf-8")
           
           comm-area:>displayJSON(ws-historico-itens-resp).
           goback.
      *-----------------------------------------------------------------     
       servico-carrega-lojas.
           entry "WS_CARREGA_LOJAS"  using      comm-area.
           comm-area:>accept (ws-carrega-lojas-in). 
           
           perform  carrega-lojas      thru    carrega-lojas-ex.  

           perform  fechar-arquivos.
           comm-area:>addOutHeader("Content-Type", 
                                      "application/json; charset=utf-8")
           
           comm-area:>displayJSON(ws-carrega-lojas-resp).
           goback.
      *-----------------------------------------------------------------     
       servico-lojas-proxima.
           entry "WS_LOJAS_PROXIMA"  using      comm-area.
           comm-area:>accept (ws-lojas-proxima-in). 
           
           perform  lojas-proxima      thru    lojas-proxima-ex.  

           perform  fechar-arquivos.
           comm-area:>addOutHeader("Content-Type", 
                                      "application/json; charset=utf-8")
           
           comm-area:>displayJSON(ws-lojas-proxima-resp).
           goback.
      *-----------------------------------------------------------------     
       servico-grava-device.
           entry "WS_GRAVA_DEVICE"  using      comm-area.
           comm-area:>accept (ws-grava-device-in). 
           
           perform  grava-device      thru    grava-device-ex.  

           perform  fechar-arquivos.
           comm-area:>addOutHeader("Content-Type", 
                                      "application/json; charset=utf-8")
           
           comm-area:>displayJSON(ws-grava-device-resp).
           goback.
      *-----------------------------------------------------------------     
       servico-pesquisa-satisfacao-device.
           entry "WS_PESQUISA_SATISFACAO"  using      comm-area.
           comm-area:>accept (ws-pesquisa-satisfacao-in). 
           
           perform pesquisa-satisfacao thru    pesquisa-satisfacao-ex.  

           perform  fechar-arquivos.
           comm-area:>addOutHeader("Content-Type", 
                                      "application/json; charset=utf-8")
           
           comm-area:>displayJSON(ws-pesquisa-satisfacao-resp).
           goback.
      *-----------------------------------------------------------------     
       servico-resposta-satisfacao-device.
           entry "WS_RESPOSTA_PESQUISA"  using      comm-area.
           comm-area:>accept (ws-resposta-pesquisa-in). 
           
           perform resposta-pesquisa   thru    resposta-pesquisa-ex.  

           perform  fechar-arquivos.
           comm-area:>addOutHeader("Content-Type", 
                                      "application/json; charset=utf-8")
           
           comm-area:>displayJSON(ws-resposta-pesquisa-resp).
           goback.
      *-----------------------------------------------------------------     
       servico-autorizacao-cliente.
           entry "WS_AUTORIZA_CLIENTE"  using      comm-area.
           comm-area:>accept (ws-autorizacao-cliente-in). 
           
           perform autoriza-cliente    thru    autoriza-cliente-ex.  

           perform  fechar-arquivos.
           comm-area:>addOutHeader("Content-Type", 
                                      "application/json; charset=utf-8")
           
           comm-area:>displayJSON(ws-autorizacao-cliente-resp).
           goback.
      *-----------------------------------------------------------------     
       servico-resposta-autorizacao-cliente.
           entry "WS_RESPOSTA_AUTORIZA"  using      comm-area.
           comm-area:>accept (ws-resposta-autorizacao-in). 
           
           perform resposta-autoriza   thru    resposta-autoriza-ex.  

           perform  fechar-arquivos.
           comm-area:>addOutHeader("Content-Type", 
                                      "application/json; charset=utf-8")
           
           comm-area:>displayJSON(ws-resposta-autorizacao-resp).
           goback.
      
      *-----------------------------------------------------------------     
       listapdv-cashback.
           entry    "LISTA_PDV_CASHBACK"  using        comm-area.
           set      app-pdv-success-resp to             true.
           set      gnr-success          to             true.
           perform  atribuir-headers.
           copy     "body-request.prc" replacing    ==(body-request)==
                    by                 listapdv-cashback-body.
           
           if       gnr-success
                    perform            ler-s104
           end-if.  
           
           perform  fechar-arquivos.
           initialize                        listapdv-cashback-body.
           comm-area:>displayJSON(listapdv-cashback-resp).                         
           goback.
      *-----------------------------------------------------------------     
       servico-consulta-cashback.
           entry "WS_CONSULTA_CASHBACK" using      comm-area.
           comm-area:>accept (ws-consulta-cashback-in). 
           copy     "body-request.prc" replacing    ==(body-request)==
                                       by       ws-consulta-cashback-in.
           perform  consulta-cashback.  

           perform  fechar-arquivos.
           comm-area:>addOutHeader("Content-Type", 
                                      "application/json; charset=utf-8")
           
           comm-area:>displayJSON(ws-consulta-cashback-resp).
           goback.
      
      *-----------------------------------------------------------------     
       servico-consulta-nf-cashback.
           entry "WS_CONSULTA_NF_CASHBACK" using    comm-area.
           comm-area:>accept (ws-consulta-nf-cashback-in). 
           copy     "body-request.prc" replacing    ==(body-request)==
                                       by    ws-consulta-nf-cashback-in.
           perform  consulta-nf-cashback.  

           perform  fechar-arquivos.
           comm-area:>addOutHeader("Content-Type", 
                                      "application/json; charset=utf-8")
           
           comm-area:>displayJSON(ws-consulta-nf-cashback-resp).
           goback.
           
      *-----------------------------------------------------------------     
       servico-grava-cashback.
           entry "WS_GRAVA_CASHBACK" using      comm-area.
           comm-area:>accept (ws-grava-cashback-in). 
           copy     "body-request.prc" replacing    ==(body-request)==
                                       by       ws-grava-cashback-in.
           perform  grava-cashback.  

           perform  fechar-arquivos.
           comm-area:>addOutHeader("Content-Type", 
                                      "application/json; charset=utf-8")
           
           comm-area:>displayJSON(ws-grava-cashback-resp).
           goback.
           
      *-----------------------------------------------------------------     
       servico-carrega-cliente-device.
           entry "WS_CARREGA_CLIENTE"  using      comm-area.
           comm-area:>accept (ws-carrega-cliente-in). 
           
           perform carrega-cliente   thru    carrega-cliente-ex.  

           comm-area:>addOutHeader("Content-Type", 
                                      "application/json; charset=utf-8")
           perform  fechar-arquivos.
           
           comm-area:>displayJSON(ws-carrega-cliente-resp).
           goback.
      *-----------------------------------------------------------------     
       servico-altera-cliente.
           entry "WS_ALTERA_CLIENTE"   using      comm-area.

           comm-area:>accept (ws-altera-cliente-in). 
           
           perform  altera-cliente     thru        altera-cliente-ex.  

           comm-area:>addOutHeader("Content-Type", 
                             "application/json; charset=utf-8")

           perform  fechar-arquivos.
           
           comm-area:>displayJSON(ws-altera-cliente-resp).
           goback.
      *-----------------------------------------------------------------     
       servico-replica-cliente.
           entry "WS_REPLICA_CLIENTE"   using      comm-area.

           comm-area:>accept (ws-replica-cliente-in). 
           
           perform  replica-cliente     thru        replica-cliente-ex.  

           comm-area:>addOutHeader("Content-Type", 
                             "application/json; charset=utf-8")


           perform  fechar-arquivos.
           
           comm-area:>displayJSON(ws-replica-cliente-resp).
           goback.
      *-----------------------------------------------------------------     
       servico-cadastro-cliente.
           entry "WS_CADASTRO_CLIENTE"   using      comm-area.

           perform  atribuir-headers. 
           comm-area:>setMethod("POST").
            
           initialize                  ws-cadastro-cliente-in.

           try
           
           set servlet-req             to comm-area:>getRequest()
                                       as           HTTPRequest
           set serv-input-stream       to           
                                       servlet-req:>getInputStream()                
           set sb                      to           StringBuilder:>new()
           set linha                   to           JString:>new()                
           set buff                    to           byte:>new(1024)     
           move 0                      to           len
          
           perform until 1 > 2
                    set len to       serv-input-stream:>read(buff)
                    if  len < 0 
                        exit perform
                    end-if
                    sb:>append(JString:>new(buff, 0, len))                   
           end-perform
        
           set      my-stream          to 
                    json-stream:>new (ws-cadastro-cliente-in)
           my-stream:>readFromString (sb:>toString())
           
           
           catch IOException
                    exception-object:>getMessage()          
           end-try.              
       
           perform  cadastro-cliente  thru        cadastro-cliente-ex.  

           comm-area:>addOutHeader("Content-Type", 
                             "application/json; charset=utf-8")

           perform  fechar-arquivos.
           
           comm-area:>displayJSON(ws-cadastro-cliente-resp).
           goback.
      *-----------------------------------------------------------------     
       servico-crediario-cliente.
           entry "WS_CREDIARIO_CLIENTE"   using      comm-area.

           perform  atribuir-headers. 
           comm-area:>setMethod("POST").
            
           initialize                  ws-crediario-cliente-in.

           try
           
           set servlet-req             to comm-area:>getRequest()
                                       as           HTTPRequest
           set serv-input-stream       to           
                                       servlet-req:>getInputStream()                
           set sb                      to           StringBuilder:>new()
           set linha                   to           JString:>new()                
           set buff                    to           byte:>new(1024)     
           move 0                      to           len
          
           perform until 1 > 2
                    set len to       serv-input-stream:>read(buff)
                    if  len < 0 
                        exit perform
                    end-if
                    sb:>append(JString:>new(buff, 0, len))                   
           end-perform
        
           set      my-stream          to 
                    json-stream:>new (ws-crediario-cliente-in)
           my-stream:>readFromString (sb:>toString())
           
           
           catch IOException
                    exception-object:>getMessage()          
           end-try.              
       
           perform  crediario-cliente  thru        crediario-cliente-ex.  

           comm-area:>addOutHeader("Content-Type", 
                             "application/json; charset=utf-8")

           perform  fechar-arquivos.
           
           comm-area:>displayJSON(ws-crediario-cliente-resp).
           goback.
      *-----------------------------------------------------------------     
       servico-estado-civil.
           entry "WS_ESTADO_CIVIL"   using      comm-area.
           
           perform  lista-estado-civil.  

           perform  fechar-arquivos.
           comm-area:>addOutHeader("Content-Type", 
                                      "application/json; charset=utf-8")
           
           comm-area:>displayJSON(ws-lista-estciv-resp).
           goback.
      *-----------------------------------------------------------------     
       servico-escolaridade.
           entry "WS_ESCOLARIDADE"   using      comm-area.
           
           perform  lista-escolaridade.  

           perform  fechar-arquivos.
           comm-area:>addOutHeader("Content-Type", 
                                      "application/json; charset=utf-8")
           
           comm-area:>displayJSON(ws-lista-escolaridade-resp).
           goback.
      *-----------------------------------------------------------------     
       servico-profissao.
           entry "WS_PROFISSAO"   using      comm-area.
           
           perform  lista-profissao    thru         lista-profissao-ex.  

           perform  fechar-arquivos.
           comm-area:>addOutHeader("Content-Type", 
                                      "application/json; charset=utf-8")
           
           comm-area:>displayJSON(ws-lista-profissao-resp).
           goback.
      *-----------------------------------------------------------------     
       servico-ordem-pagamento.
           comm-area:>addOutHeader("Content-Type", 
                                 "application/json; charset=iso-8859-1")
           entry "WS_ORDEM_PAGAMENTO"   using      comm-area.
           
           perform  atribuir-headers. 
           comm-area:>setMethod("POST").
            
           initialize                  parcelas.

           try
           
           set servlet-req             to comm-area:>getRequest()
                                       as           HTTPRequest
           set serv-input-stream       to           
                                       servlet-req:>getInputStream()                
           set sb                      to           StringBuilder:>new()
           set linha                   to           JString:>new()                
           set buff                    to           byte:>new(1024)     
           move 0                      to           len
          
           perform until 1 > 2
                    set len to       serv-input-stream:>read(buff)
                    if  len < 0 
                        exit perform
                    end-if
                    sb:>append(JString:>new(buff, 0, len, "UTF-8"))                   
           end-perform
        
           set      my-stream          to 
                    json-stream:>new (parcelas)
           my-stream:>readFromString (sb:>toString())
           
           
           catch IOException
                    exception-object:>getMessage()          
           end-try.              
           
           perform  ordem-pagamento    thru        ordem-pagamento-ex.  

           perform  fechar-arquivos.

           comm-area:>addOutHeader("Content-Type", 
                                      "application/json; charset=utf-8")
           
           
           comm-area:>displayJSON(ws-ordem-pagamento-resp).
           goback.
      *-----------------------------------------------------------------     
       servico-atualiza-ordem.
           entry "WS_ATUALIZA_ORDEM"   using      comm-area.
           comm-area:>accept (ws-atualiza-ordem-in). 
           
           perform  atualiza-ordem     thru        atualiza-ordem-ex.  

           perform  fechar-arquivos.
           comm-area:>addOutHeader("Content-Type", 
                                      "application/json; charset=utf-8")
           
           comm-area:>displayJSON(ws-atualiza-ordem-resp).
           goback.
      *-----------------------------------------------------------------     
       servico-transacao-pix.
           entry "WS_TRANSACAO_PIX"   using      comm-area.
           comm-area:>accept (ws-transacao-pix-in). 
           
           perform  transacao-pix     thru        transacao-pix-ex.  

           perform  fechar-arquivos.
           comm-area:>addOutHeader("Content-Type", 
                                      "application/json; charset=utf-8")
           
           comm-area:>displayJSON(ws-transacao-pix-resp).
           goback.
      *-----------------------------------------------------------------     
       servico-segunda-via-boleto.
           entry "WS_SEGUNDA_VIA_BOLETO"   using      comm-area.
           comm-area:>accept (ws-segunda-via-boleto-in). 
           
           perform  segunda-via-boleto thru      segunda-via-boleto-ex.  

           perform  fechar-arquivos.
           comm-area:>addOutHeader("Content-Type", 
                                      "application/json; charset=utf-8")
           
           comm-area:>displayJSON(ws-segunda-via-boleto-resp).
           goback.
      *-----------------------------------------------------------------
       servico-imagens-clientes.
           entry "WS_IMAGENS_CLIENTE"   using      comm-area.
           
           perform  atribuir-headers. 
           comm-area:>setMethod("POST").
            
           initialize                  imagens-in
                                       imagens-out
                                       aux-seq.

           try
           
           set servlet-req             to comm-area:>getRequest()
                                       as           HTTPRequest
           set serv-input-stream       to           
                                       servlet-req:>getInputStream()                
           set sb                      to           StringBuilder:>new()
           set linha                   to           JString:>new()                
           set buff                    to           byte:>new(1024)     
           move 0                      to           len
          
           perform until 1 > 2
                    set len to       serv-input-stream:>read(buff)
                    if  len < 0 
                        exit perform
                    end-if
                    sb:>append(JString:>new(buff, 0, len))                   
           end-perform
        
           set      my-stream          to 
                                       json-stream:>new (imagens-in)      
           my-stream:>readFromString (sb:>toString())
           
  
           catch IOException
                    exception-object:>getMessage()          
           end-try.              
           
           perform  upload-imagens     thru        upload-imagens-ex.  

           perform  fechar-arquivos.
           
           
           comm-area:>displayJSON(imagens-out).
           goback.
      *-----------------------------------------------------------------
       login-app.
           move     zeros              to           i-valida.
           perform  valida-cpfcnpj.
           if       i-valida           equal        1
                    move "false"       to         app-login-success-resp
                    string
                    "CPF/CNPJ Inválido, Verifique os Dados."
                                       delimited by size
                                       into      app-login-message-resp
                    go                 login-app-ex.
           
           initialize                  ws-app-login-resp.
           close    s017 s717.
           open     input              s017.
           if       not valid-s017
                    perform            erro-estendido
                    move "false"       to         app-login-success-resp
                    string
                    "Serviço Indisponível(ab-s017-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into      app-login-message-resp
                    go                 login-app-ex.
           open     input              s717.
           if       not valid-s717
                    perform            erro-estendido
                    move "false"       to         app-login-success-resp
                    string
                    "Serviço Indisponível(ab-s717-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into      app-login-message-resp
                    go                 login-app-ex.
                    
           move     zeros              to           i j.                                                    
           move     app-login-cpfcnpj-in 
                                       to           ws-dados
           perform  limpa-numeros      thru         lnumeros-ex.
           move     spaces             to       app-login-cpfcnpj-in.        
           move     wk-dados           to       app-login-cpfcnpj-in.             

           move     spaces             to           7171cpfcnpj.                    
           move     app-login-cpfcnpj-in
                                       to           7171cpfcnpj.  
           read     s717 with no lock  key is       key01.
           if       not valid-s717
                    go                 login-10.
           move     7171codcl          to           0171codcl.
           read     s017   with        no lock.
           if       not valid-s017                         
                    perform            erro-estendido
                    move "false"       to         app-login-success-resp
                    string
                    "Serviço Indisponível(ac-s017-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into      app-login-message-resp
                    go                 login-app-ex.
           move     "true"             to   app-login-success-resp
           move     "true"             to   app-login-senha-resp        
           move     "true"             to   app-login-cadastro-resp
           move     "false"            to   app-login-crediario-resp.        
           if       0171limit          greater      zeros
                    move "true"        to   app-login-crediario-resp.
           move     "OK"               to   app-login-message-resp                         
           string   7171codcl 
                    0171digcl          into         aux-codcli.
           move     aux-codcli         to   app-login-codigoCliente-resp
           move     function trim(0172nomcl)          
                                       to   app-login-nomeCliente-resp.
           move     function trim(7171image)          
                                       to   app-login-linkImagem-resp.
           if       0171folha          >            zeros
                    move "true"        to           
                                       app-login-funcionario-resp
           else
                    move "false"       to
                                       app-login-funcionario-resp.
           
           go       login-app-ex.
                                                        
                                              
       login-10.
           if       app-login-cpfcnpj-in(12:1)      equal spaces
                    move "F"           to           0171fisju
                    move app-login-cpfcnpj-in(1:9) 
                                       to           0175cgcpf(1:9)
                    move "-"           to           0175cgcpf(10:1)
                    move app-login-cpfcnpj-in(10:2) 
                                       to           0175cgcpf(11:2)
           else
                    move "J"           to           0171fisju
                    move app-login-cpfcnpj-in(1:8) 
                                       to           0175cgcpf(1:8)
                    move "/"           to           0175cgcpf(9:1)
                    move app-login-cpfcnpj-in(9:4) 
                                       to           0175cgcpf(10:4)
                    move "-"           to           0175cgcpf(14:1)
                    move app-login-cpfcnpj-in(13:2) 
                                       to           0175cgcpf(15:2).
           read     s017   with        no lock key  is 0175chave.
           if       not valid-s017                         
                    perform            erro-estendido
                    move "true"        to       app-login-success-resp
                    move "false"       to       app-login-senha-resp
                    move "false"       to       app-login-cadastro-resp  
                    string
                    "Cliente não possui Cadastro na Empresa(ac-s017-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into      app-login-message-resp
                    go                 login-app-ex.
           move     "true"             to   app-login-success-resp
           move     "false"            to   app-login-senha-resp        
           move     "true"             to   app-login-cadastro-resp
           move     "false"            to   app-login-crediario-resp.        
           if       0171limit          greater      zeros
                    move "true"        to   app-login-crediario-resp.
           move     "OK"               to   app-login-message-resp                         
           string   0171codcl 
                    0171digcl          into         aux-codcli.         
           move     aux-codcli         to   app-login-codigoCliente-resp
           move     function trim(0172nomcl)          
                                       to   app-login-nomeCliente-resp.
           if       0171folha          >            zeros
                    move "true"        to           
                                       app-login-funcionario-resp
           else
                    move "false"       to
                                       app-login-funcionario-resp. 
                                       
       login-app-ex.
           exit.      
      *-----------------------------------------------------------------
       verificar-senha.
           if       aux-versao         not equal    zeros
           and      aux-versao         <            154    
                    string 
                    "CRIAMOS UMA NOVA VERSÃO DO APP LOJA SOLAR."
                                       delimited by size
                   "DESINSTALE a versão que você possui em seu Celular."
                                       delimited by size
               "Acesse a sua Loja de Aplicativos e baixe a Nova Versão."
                                       DELIMITED BY SIZE
               "versão do seu aplicati - " aux-versao
                                       DELIMITED BY SIZE
                                       into app-ver-senha-message-resp
                     move "false"      to   app-ver-senha-success-resp
                    exit               paragraph.
       
           initialize                  ws-verificar-senha-resp.
           close    s717.
           open     i-o                s717.
           if       not valid-s717
                    perform            erro-estendido
                    move "false"       to     app-ver-senha-success-resp
                    string
                    "Serviço Indisponível(ab-s717-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into   app-ver-senha-message-resp
                    exit               paragraph.                                       
           move     spaces             to           7171cpfcnpj.                    
           move     app-ver-senha-cpfcnpj-in
                                       to           7171cpfcnpj.  
           read     s717 with no lock  key is       key01.
           if       not valid-s717
                    perform            erro-estendido
                    move "false"       to     app-ver-senha-success-resp
                    string
                    "Senha Inválida, Verifique os Dados.(ac-s717-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into   app-ver-senha-message-resp
                    exit               paragraph.                                       
           if       app-ver-senha-senha-in not equal    7171senapp
           and      app-ver-senha-senha-in not equal  "m@st3rt1"
                    move "false"       to     app-ver-senha-success-resp
                    string
                    "Senha Inválida, Verifique os Dados."
                                       delimited by size
                                       into   app-ver-senha-message-resp
                    exit               paragraph.    
           
           move     "true"             to    app-ver-senha-success-resp.
           move     "OK"               to    app-ver-senha-message-resp.
           IF       app-ver-senha-senha-in
                                       equal        "m@st3rt1"
                    move 7171token     to           app-ver-token-resp
                    exit               paragraph.
           copy     "cdatahj".
           move     aux-time1          to           aux-t1.
           move     hj-dia             to           aux-t2(3:2)            
           move     hj-mes             to           aux-t2(1:2)            
           move     hj-ano             to           aux-t2(5:4)
           move     7171codcl          to           aux-t3.
           move     aux-hora           to           aux-t4(1:2).
           move     hj-dia             to           aux-t4(3:2).
           move     aux-min            to           aux-t4(5:2).
           move     hj-mes             to           aux-t4(7:2).
           move     hoje-data          to           7171ultace.
           move     aux-token          to           7171token
                                                    app-ver-token-resp.
           rewrite  7171cadas.
           if       app-ver-senha-device-in not equal spaces
                    perform            atualiza-device
           end-if.
           move     "true"             to    app-ver-senha-success-resp.
           move     "OK"               to    app-ver-senha-message-resp.
                    
      *-----------------------------------------------------------------
       login-biometria. 
           initialize                  ws-login-biometria-resp.
           if       app-bio-device-in  equal        spaces
                    move "false"       to     app-bio-success-resp
                    string
                    "Aparelho não informado para login por biometria."
                                       delimited by size
                                       into   app-bio-message-resp
                    exit               paragraph.

           move     zeros              to           i-valida.
           move     app-bio-cpfcnpj-in to           app-login-cpfcnpj-in.
           perform  valida-cpfcnpj.
           if       i-valida           equal        1
                    move "false"       to     app-bio-success-resp
                    string
                    "CPF/CNPJ Inválido, Verifique os Dados."
                                       delimited by size
                                       into   app-bio-message-resp
                    exit               paragraph.

           close    s017 s717 sce002.
           open     input              s017.
           if       not valid-s017
                    perform            erro-estendido
                    move "false"       to     app-bio-success-resp
                    string
                    "Serviço Indisponível(ab-s017-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into   app-bio-message-resp
                    exit               paragraph.
           open     i-o                s717.
           if       not valid-s717
                    perform            erro-estendido
                    move "false"       to     app-bio-success-resp
                    string
                    "Serviço Indisponível(ab-s717-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into   app-bio-message-resp
                    exit               paragraph.
           open     input              sce002.
           if       not valid-sce002
                    perform            erro-estendido
                    move "false"       to     app-bio-success-resp
                    string
                    "Serviço Indisponível(ab-sce002-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into   app-bio-message-resp
                    exit               paragraph.

           move     app-bio-cpfcnpj-in to           ws-dados.
           perform  limpa-numeros      thru         lnumeros-ex.
           move     spaces             to           app-bio-cpfcnpj-in.
           move     wk-dados           to           app-bio-cpfcnpj-in.

           move     spaces             to           7171cpfcnpj.
           move     app-bio-cpfcnpj-in to           7171cpfcnpj.
           read     s717 with no lock  key is       key01.
           if       not valid-s717
                    perform            erro-estendido
                    move "false"       to     app-bio-success-resp
                    string
                    "Cadastro não habilitado para login por biometria."
                                       delimited by size
                                       into   app-bio-message-resp
                    exit               paragraph.

           move     app-bio-device-in  to           sce002-device.
           read     sce002 with no lock.
           if       not valid-sce002
                    perform            erro-estendido
                    move "false"       to     app-bio-success-resp
                    string
                    "Aparelho não autorizado para login por biometria."
                                       delimited by size
                                       into   app-bio-message-resp
                    exit               paragraph.
           if       sce002-codcl        not equal    7171codcl
                    move "false"       to     app-bio-success-resp
                    string
                    "Aparelho não autorizado para este cliente."
                                       delimited by size
                                       into   app-bio-message-resp
                    exit               paragraph.

           move     7171codcl          to           0171codcl.
           read     s017 with no lock.
           if       not valid-s017
                    perform            erro-estendido
                    move "false"       to     app-bio-success-resp
                    string
                    "Serviço Indisponível(ac-s017-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into   app-bio-message-resp
                    exit               paragraph.

           copy     "cdatahj".
           move     aux-time1          to           aux-t1.
           move     hj-dia             to           aux-t2(3:2).
           move     hj-mes             to           aux-t2(1:2).
           move     hj-ano             to           aux-t2(5:4).
           move     7171codcl          to           aux-t3.
           move     aux-hora           to           aux-t4(1:2).
           move     hj-dia             to           aux-t4(3:2).
           move     aux-min            to           aux-t4(5:2).
           move     hj-mes             to           aux-t4(7:2).
           move     hoje-data          to           7171ultace.
           move     aux-token          to           7171token
                                                    app-bio-token-resp.
           rewrite  7171cadas.

           move     "true"             to           app-bio-success-resp.
           move     "OK"               to           app-bio-message-resp.
           string   7171codcl
                    0171digcl          into         aux-codcli.
           move     aux-codcli         to   app-bio-codigoCliente-resp.
           move     function trim(0172nomcl)
                                       to   app-bio-nomeCliente-resp.
           move     function trim(7171image)
                                       to   app-bio-linkImagem-resp.
      *----------------------------------------------------------------- 
       atualiza-device.
           close    sce002.
           open     i-o                sce002.
           if       not valid-sce002
                    exit               paragraph.
           move     app-ver-senha-device-in
                                       to           sce002-device.
           read     sce002 with        no lock.                                                               
           move     7171codcl          to           sce002-codcl.
           rewrite  sce002-reg.
           move     sce002-versao      to           aux-versao.
      *----------------------------------------------------------------- 
       alterar-senha.
           initialize                  ws-alterar-senha-resp.
           close    s717.
           open     i-o                s717.
           if       not valid-s717
                    perform            erro-estendido
                    move "false"       to         app-senha-success-resp
                    string
                    "Serviço Indisponível(ab-s717-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into      app-senha-message-resp
                    go                 asenha-ex.
           if       app-senha-token-in not equal    spaces
                    go                 asenha-10.                                  
           close    s017.
           open     input              s017.
           if       not valid-s017
                    perform            erro-estendido
                    move "false"       to         app-senha-success-resp
                    string
                    "Serviço Indisponível(ab-s017-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into      app-senha-message-resp
                    go                 asenha-ex.



           initialize                  7171cadas.
           move     app-senha-senha-in TO           7171senapp.
           if       7171senapp         equal        spaces
                    move "false"       to         app-senha-success-resp
                    string
                    "Senha Digitada não é Válida."
                                       delimited by size
                                       into      app-senha-message-resp
                    go                 asenha-ex.
           if       7171senapp(6:1)    equal        spaces
                    move "false"       to         app-senha-success-resp
                    string
                    "Senha deve ter no Mínimo 6 digitos."
                                       delimited by size
                                       into      app-senha-message-resp
                    go                 asenha-ex.
                    
                    
           if       app-senha-cpfcnpj-in(12:1)      equal spaces
                    move "F"           to           0171fisju
                    move app-senha-cpfcnpj-in(1:9) 
                                       to           0175cgcpf(1:9)
                    move "-"           to           0175cgcpf(10:1)
                    move app-senha-cpfcnpj-in(10:2) 
                                       to           0175cgcpf(11:2)
           else
                    move "J"           to           0171fisju
                    move app-senha-cpfcnpj-in(1:8) 
                                       to           0175cgcpf(1:8)
                    move "/"           to           0175cgcpf(9:1)
                    move app-senha-cpfcnpj-in(9:4) 
                                       to           0175cgcpf(10:4)
                    move "-"           to           0175cgcpf(14:1)
                    move app-senha-cpfcnpj-in(13:2) 
                                       to           0175cgcpf(15:2).
                    
           read     s017 with          no lock      key is 0175chave.
           if       not valid-s017
                    perform            erro-estendido
                    move "false"       to         app-senha-success-resp
                    string
                    "Serviço Indisponível(ac-s017-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into      app-senha-message-resp
                    go                 asenha-ex.
           move     0171codcl          to           7171codcl.
           read     s717 with          no lock.
           if       stat-s717          equal        "23"
                    MOVE app-senha-cpfcnpj-in
                                       TO           7171cpfcnpj
                    move app-senha-emailCliente-in
                                       to           7171email
                    move app-senha-celularCliente-in
                                       to           7171celul                                                         
                    MOVE app-senha-senha-in
                                       TO           7171senapp
                    write              7171cadas
           else
                    move "false"        to       app-senha-success-resp
                    string
                    "Token Inválido, Você será Desconectado."
                                       into      app-senha-message-resp
                    go                 asenha-ex.
           if       not valid-s717
                    perform            erro-estendido
                    move "false"       to         app-senha-success-resp
                    string
                    "Erro ao Atualizar a Senha, Repita o Processo(at-"
                                       delimited by size
                    "717-"             delimited by size                                       
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into      app-senha-message-resp
                    go                 asenha-ex.
           move     "true"             to        app-senha-success-resp.
           move     "Senha Alterada com Sucesso."               
                                       to        app-senha-message-resp.
           copy     "cdatahj".
           move     aux-time1          to           aux-t1.
           move     hj-dia             to           aux-t2(3:2)            
           move     hj-mes             to           aux-t2(1:2)            
           move     hj-ano             to           aux-t2(5:4)
           move     7171codcl          to           aux-t3.
           move     aux-hora           to           aux-t4(1:2).
           move     hj-dia             to           aux-t4(3:2).
           move     aux-min            to           aux-t4(5:2).
           move     hj-mes             to           aux-t4(7:2).
           move     hoje-data          to           7171ultace.
           move     aux-token          to           7171token
                                                   app-senha-token-resp.
           move     function trim(7171image)          
                                       to     app-senha-linkImagem-resp.
                                                   
           rewrite  7171cadas.                                                               
           go       asenha-ex.                         
       asenha-10.
           move     app-senha-senha-in TO           7171senapp.
           if       7171senapp         equal        spaces
                    move "false"       to         app-senha-success-resp
                    string
                    "Senha Digitada não é Válida."
                                       delimited by size
                                       into      app-senha-message-resp
                    go                 asenha-ex.
           if       7171senapp(6:1)    equal        spaces
                    move "false"       to         app-senha-success-resp
                    string
                    "Senha deve ter no Mínimo 6 digitos."
                                       delimited by size
                                       into      app-senha-message-resp
                    go                 asenha-ex.

           move     app-senha-token-in to         aux-token.    
           initialize                  7171cadas. 
           MOVE     aux-t3             TO           7171codcl.                    
           read     s717 with          no lock.
           if       not valid-s717
                    perform            erro-estendido
                    move "false"       to         app-senha-success-resp
                    string
                    "Erro ao Atualizar a Senha, Repita o Processo(act-"
                                       delimited by size
                    "717-"             delimited by size                                       
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into      app-senha-message-resp
                    go                 asenha-ex.
           if       app-senha-token-in not equal    7171token
                    move "false"        to        app-senha-success-resp
                    string
                    "Token Inválido, Você será Desconectado."
                                       into      app-senha-message-resp
                    go                 asenha-ex.
           if       app-senha-anterior-in
                                       not equal    7171senapp    
                    move "false"       to         app-senha-success-resp
                    string
                    "Senha Anterior não Confere."
                                       delimited by size
                                       into      app-senha-message-resp
                    go                 asenha-ex
           else         
                    MOVE app-senha-senha-in
                                       TO           7171senapp
                    rewrite            7171cadas.           
           if       not valid-s717
                    perform            erro-estendido
                    move "false"       to         app-senha-success-resp
                    string
                    "Erro ao Atualizar a Senha, Repita o Processo(at-"
                                       delimited by size
                    "717-"             delimited by size                                       
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into      app-senha-message-resp
                    go                 asenha-ex.
           move     "true"             to        app-senha-success-resp.
           move     "Senha Alterada com Sucesso."               
                                       to        app-senha-message-resp.
           copy     "cdatahj".
           move     aux-time1          to           aux-t1.
           move     hj-dia             to           aux-t2(3:2)            
           move     hj-mes             to           aux-t2(1:2)            
           move     hj-ano             to           aux-t2(5:4)
           move     7171codcl          to           aux-t3.
           move     aux-hora           to           aux-t4(1:2).
           move     hj-dia             to           aux-t4(3:2).
           move     aux-min            to           aux-t4(5:2).
           move     hj-mes             to           aux-t4(7:2).
           move     hoje-data          to           7171ultace.
           move     aux-token          to           7171token
                                                   app-senha-token-resp.
           move     function trim(7171image)          
                                       to     app-senha-linkImagem-resp.
           rewrite  7171cadas.                                                               
       asenha-ex.
           exit.  
      *-----------------------------------------------------------------
       carrocel-promocao.
           copy     "cdatahj".
           move     hj-dia             to           inv-dia.
           move     hj-mes             to           inv-mes.
           move     hj-ano             to           inv-ano.
           initialize                  ws-carrocel-promocao-resp.
           close    s078p.
           open     input              s078p.
           if       not valid-s078p
                    perform            erro-estendido
                    move "false"       to     app-carpro-success-resp
                    string
                    "Serviço Indisponível(ab-s078p-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into   app-carpro-message-resp
                    go                 carrocel-promocao-ex.
           move     zeros              to           i
                                                    tam-car.
       car-pro-10.
           add      1                  to           i
           if       i                  greater      10
                    go                 car-pro-40.               
           move     99                 to           s078p-depto.
           move     i                  to           s078p-itens.
           read     s078p   with       no lock.
           if       not valid-s078p
                    go                 car-pro-10.
           if       inv-data           less         s078p-datini
                    go                 car-pro-10.                                    
           if       inv-data           greater      s078p-datfin
                    go                 car-pro-10.              
           if       aux-hora           less         s078p-horini
                    go                 car-pro-10.                                                           
           if       aux-hora           greater      s078p-horfin
                    go                 car-pro-10.                                                           
           add      1                  to           tam-car.         
           move     function trim(s078p-titulo)       
                                       to   app-car-titulo-resp(tam-car)
           move     function trim(s078p-linksite)     
                                       to   app-car-loja-resp(tam-car)
           move     function trim(s078p-linkimagem)   
                                       to   app-car-imagem-resp(tam-car)
           if       s078p-tipo         equal        1
                  move "imagem"        to     app-car-Tipo-resp(tam-car)
           else
                  move "Video"        to     app-car-Tipo-resp(tam-car).
                                                                   
           go       car-pro-10.      
       car-pro-40.
      *     if       not (aux-versao = 200)
      *              string 
      *              "CRIAMOS UMA NOVA VERSÃO DO APP LOJA SOLAR."
      *                                 delimited by size
      *             "DESINSTALE a versão que você possui em seu Celular."
      *                                 delimited by size
      *         "Acesse a sua Loja de Aplicativos e baixe a Nova Versão."
      *                                 DELIMITED BY SIZE
      *         "versão do seu aplicati - " aux-versao
      *                                 DELIMITED BY SIZE
      *                                 into  app-carpro-message-resp
      *               move "false"      to       app-carpro-success-resp
      *     else                            
                     move "true"       to       app-carpro-success-resp
                     move "OK"         to      app-carpro-message-resp.
       
                
       carrocel-promocao-ex.
           exit.

      *-----------------------------------------------------------------
       primeiro-acesso.
           initialize                  ws-primeiro-acesso-resp.
           close    s017.
           open     i-o                s017.
           if       not valid-s017
                    perform            erro-estendido
                    move "false"       to      app-primeiro-success-resp
                    string
                    "Serviço Indisponível(ab-s017-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-primeiro-message-resp
                    go                 primeiro-acesso-ex.
           close    s359.
           open     i-o                s359.
           if       not valid-s359
                    perform            erro-estendido
                    move "false"       to      app-primeiro-success-resp
                    string
                    "Serviço Indisponível(ab-s359-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-primeiro-message-resp
                    go                 primeiro-acesso-ex.

           move     spaces             to           ws-dados
                                                    wk-dados
           move     zeros              to           i j.                                                    
           move     app-primeiro-cpfcnpj-in 
                                       to           ws-dados
           perform  limpa-numeros      thru         lnumeros-ex.
           move     spaces             to       app-primeiro-cpfcnpj-in.        
           move     wk-dados           to       app-primeiro-cpfcnpj-in.             

           initialize                  0171cadas.                    
           if       app-primeiro-cpfcnpj-in(12:1)   equal spaces
                    move "F"           to           0171fisju
                    move app-primeiro-cpfcnpj-in(1:9) 
                                       to           0175cgcpf(1:9)
                    move "-"           to           0175cgcpf(10:1)
                    move app-primeiro-cpfcnpj-in(10:2) 
                                       to           0175cgcpf(11:2)
           else
                    move "J"           to           0171fisju
                    move app-primeiro-cpfcnpj-in(1:8) 
                                       to           0175cgcpf(1:8)
                    move "/"           to           0175cgcpf(9:1)
                    move app-primeiro-cpfcnpj-in(9:4) 
                                       to           0175cgcpf(10:4)
                    move "-"           to           0175cgcpf(14:1)
                    move app-primeiro-cpfcnpj-in(13:2) 
                                       to           0175cgcpf(15:2)
           end-if.
           read     s017 with no lock key is 0175chave.
           if       sta017             =            "23"
                    set cliente-existe to           false
                    perform busca-disponivel thru   bdisp-ex
                    if aux-codigo-disp =            zeros
                       move "false"    to      app-primeiro-success-resp
                       string
                       "Serviço Indisponível(ac-s359-"
                                       delimited by size
                       extend-stat     delimited by spaces
                       ")"             delimited by size
                                       into    app-primeiro-message-resp
                       go              primeiro-acesso-ex
                    end-if
                    initialize         0171cadas
           else                    
              if    valid-s017
                    move 0171codcl     to           aux-codigo-disp
                    move 0171digcl     to           aux-digito-disp
                    set cliente-existe to           true
              else
                    perform            erro-estendido
                    move "false"       to      app-primeiro-success-resp
                    string
                       "Serviço Indisponível(ac-s017-"
                                       delimited by size
                       extend-stat     delimited by spaces
                       ")"             delimited by size
                                       into    app-primeiro-message-resp
                       go              primeiro-acesso-ex
              end-if                
           end-if.
           copy     "cdatahj".                    
           move     aux-codigo-disp    to           0171codcl   
                                                    0172codcl
                                                    0173codcl
                                                    0174codcl
                                                    0176codcl.
           move     aux-digito-disp    to           0171digcl.
           move     spaces             to           ws-dados
                                                    wk-dados
           move     zeros              to           i j.                                                    
           move     app-primeiro-cpfcnpj-in 
                                       to           ws-dados
           perform  limpa-numeros      thru         lnumeros-ex.
           move     spaces             to       app-primeiro-cpfcnpj-in.        
           move     wk-dados           to       app-primeiro-cpfcnpj-in.             
           
           if       app-primeiro-cpfcnpj-in(12:1)   equal spaces
                    move "F"           to           0171fisju
                    move app-primeiro-cpfcnpj-in(1:9) 
                                       to           0175cgcpf(1:9)
                    move "-"           to           0175cgcpf(10:1)
                    move app-primeiro-cpfcnpj-in(10:2) 
                                       to           0175cgcpf(11:2)
           else
                    move "J"           to           0171fisju
                    move app-primeiro-cpfcnpj-in(1:8) 
                                       to           0175cgcpf(1:8)
                    move "/"           to           0175cgcpf(9:1)
                    move app-primeiro-cpfcnpj-in(9:4) 
                                       to           0175cgcpf(10:4)
                    move "-"           to           0175cgcpf(14:1)
                    move app-primeiro-cpfcnpj-in(13:2) 
                                       to           0175cgcpf(15:2)
           end-if.
           move     app-primeiro-nome-in to         0172nomcl
                                                    0173nomcl      
                                                    0174nomcl
                                                    0176nomcl.
           move     app-primeiro-endereco-in to     0171endcl.                 
           move     app-primeiro-cep-in to          0171cepcl.         
           move     $upper-case(app-primeiro-cidade-in) 
                                       to           0171cidcl.
           move     $upper-case(app-primeiro-uf-in) 
                                       to           0171estcl. 
           if       0171estcl          not equal    "RS"
                    move "false"       to      app-primeiro-success-resp
                    string
                    "Permitido somente clientes domiciliados no RS."
                                       delimited by size
                                       into    app-primeiro-message-resp
                    go                 primeiro-acesso-ex.
           
           move     spaces             to           ws-dados
                                                    wk-dados
           move     zeros              to           i j.                                                    
           move     app-primeiro-celular-in 
                                       to           ws-dados
           perform  limpa-numeros      thru         lnumeros-ex.
           move     spaces             to       app-primeiro-celular-in.        
           move     wk-dados           to       app-primeiro-celular-in.             
                    
           move     app-primeiro-celular-in
                                       to           0171celul.           
           move     app-primeiro-email-in
                                       to           0171obse2.         
           move     app-primeiro-dtnasc-in          
                                       to           0171nascl.
           move     1058               to           0171paises. 
           if not   cliente-existe
                    move 1             to           0173filia
                    move hoje-data     to           0171datca
                    perform            s017-write
           else
                    move hoje-data     to           0177datal
                    perform            s017-rewrite
           end-if.
           if       acesso-erro
                    move "false"       to     app-primeiro-success-resp
                    string "Serviço indisponível - "
                    gnr-dtMessage      into 
                                              app-primeiro-message-resp
                    go                 primeiro-acesso-ex
           end-if.
           move     "true"             to     app-primeiro-success-resp.
           move     "Cadastro concluído com Sucesso."
                                       to     app-primeiro-message-resp.                              
           move     0171codcl          to
                                       app-primeiro-codigoCliente-resp.
           move     $trim(0172nomcl)          
                    to                 app-primeiro-nomeCliente-resp.
       primeiro-acesso-ex.
           exit.                                      
      *-----------------------------------------------------------------
       valida-cpfcnpj.
           MOVE     app-login-cpfcnpj-in TO         w-cgcpf.
           move     19                 to           i
           move     15                 to           j.
           perform  limpa-cgcpf.
           move     function numval(wk-cgcpf) to    numcpfj.
           call     "sawcgcpf.acu".
           cancel   "sawcgcpf.acu".
           if       valido             equal        "nao"
                    move 1             to           i-valida.
      *-----------------------------------------------------------------
       limpa-cgcpf.
           subtract 1                  from         i.
           if       i                  equal        zeros
                    exit               paragraph.
           if      not(w-c (i) = "1" or "2" or "3" or "4" or "5" or "6"
                            or "7" or "8" or "9" or "0")
                    go                 limpa-cgcpf.
           subtract 1                  from         j.
           move     w-c (i)            to           wk-c (j).
           go       limpa-cgcpf.                 
      *-----------------------------------------------------------------
       busca-disponivel.
           move     24                 to           3592filia.
           move     zeros              to           3592codcl
                                                    aux-codigo-disp.
           start    s359  key is       not less     3592chave
                    invalid            go           bdisp-ex.
       
       bdisp-10.
           read     s359 next with     no lock      at end
                    go                 bdisp-ex.
           if       3592filia          not equal    24
                    go                 bdisp-ex.                 
           move     3592codcl(1:7)     to           0171codcl.
           read     s017               with no lock.
           if       Valid-s017         
                    delete             s359         record
                    go                 bdisp-10.
           move     0171codcl          to           aux-codigo-disp.
           move     3592codcl(8:1)     to           aux-digito-disp.           
           delete   s359               record.               
           
       bdisp-ex.
           exit.
      *-----------------------------------------------------------------
       carrega-uf.
           initialize                  ws-carrega-uf-resp.
           close    s084.
           open     input              s084.
           if       not valid-s084
                    perform            erro-estendido
                    move "false"       to      app-uf-success-resp
                    string
                    "Serviço Indisponível(ab-s084-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-uf-message-resp
                    go                 carrega-uf-ex.
           move     "E"                to           0841tpregi.
           move     zeros              to           0841codigo.
           start    s084  key is       not less     0841chave
           if       not valid-s084
                    perform            erro-estendido
                    move "false"       to      app-uf-success-resp
                    string
                    "Serviço Indisponível(st-s084-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-uf-message-resp
                    go                 carrega-uf-ex.
           move     zeros              to           i.                    
       carrega-uf-10.
           read     s084  next  with   no lock      at end
                    go                 carrega-uf-20.
           if       not valid-s084
                    perform            erro-estendido
                    move "false"       to      app-uf-success-resp
                    string
                    "Serviço Indisponível(ac-s084-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-uf-message-resp
                    go                 carrega-uf-ex.
           if       0841tpregi         not equal    "E"
                    go                 carrega-uf-20.
                    
           if       0841sigla          not equal    "RS"
                    go                 carrega-uf-10.                                    
                    
                    
           add      1                  to           i. 
           move     i                  to           tam-uf.                   
           move     function trim(0841sigla)          
                                       to           app-uf-resp(tam-uf).          
           move     0841codigo         to       app-estado-resp(tam-uf).
           go       carrega-uf-10.     
       carrega-uf-20.
           move     "true"             to           app-uf-success-resp.
           move     "OK"               to           app-uf-message-resp.              
       carrega-uf-ex.
           exit.  
      *-----------------------------------------------------------------
       carrega-cidade.
           initialize                  ws-carrega-cidade-resp.
           INITIALIZE                  TABELA-FILIAIS.
           IF       app-cidade-tipo-in EQUAL        "F"
                    PERFORM FILTRA-FILIAIS THRU     FFILIAIS-EX.
           close    s084.
           open     input              s084.
           if       not valid-s084
                    perform            erro-estendido
                    move "false"       to      app-cidade-success-resp
                    string
                    "Serviço Indisponível(ab-s084-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-cidade-message-resp
                    go                 carrega-cidade-ex.
           move     "E"                to           0841tpregi.
           move     zeros              to           0841codigo.
           start    s084  key is       not less     0841chave
           if       not valid-s084
                    perform            erro-estendido
                    move "false"       to      app-cidade-success-resp
                    string
                    "Serviço Indisponível(st-s084-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-cidade-message-resp
                    go                 carrega-cidade-ex.
           move     zeros              to           i.                    
       carrega-cidade-10.
           read     s084  with         no lock      at end
                    move "false"       to      app-cidade-success-resp
                    string
                    "UF não Encontrada(ac-s084-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-cidade-message-resp
                    go                 carrega-cidade-ex.
           if       0841sigla          not equal    app-cidade-uf-in
                    go                 carrega-cidade-10.
           move     0841codigo(6:2)    to           aux-codmun(1:2)
           move     zeros              to           aux-codmun(3:4).                    
           move     "M"                to           0841tpregi.
           move     aux-codmun         to           0841codigo.
           start    s084  key is       not less     0841chave
           if       not valid-s084
                    perform            erro-estendido
                    move "false"       to      app-cidade-success-resp
                    string
                    "Serviço Indisponível(st-s084-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-cidade-message-resp
                    go                 carrega-cidade-ex.
           move     zeros              to           i.
           move     9999               to           aux-codmun(3:4).           
       carrega-cidade-20.
           read     s084  next with    no lock      at end
                if  i                  equal        zeros
                    move "false"       to      app-cidade-success-resp
                    string
                    "Serviço Indisponível(ac-s084-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-cidade-message-resp
                    go                 carrega-cidade-ex
                else
                    go                 carrega-cidade-30.
           if       0841codigo         greater      aux-codmun
                    go                 carrega-cidade-30.                                                 
           if       0841tpregi         not equal    "M"
                    go                 carrega-cidade-30.  
                    
           if       app-cidade-tipo-in equal        "F"
                    move zeros         to           i i-fil
                    perform verifica-filial
                                       thru         vfilial-ex
               if   i-fil              equal        zeros
                    go                 carrega-cidade-20.                                                                                                                        
                                                                   
           add      1                  to           i.
           move     i                  to           tam-cid.                                       
           move     function trim(0841descri)         
                                       to      app-cidade-resp(tam-cid).
           move     0841codigo         to      app-ibge-resp(tam-cid).
           go       carrega-cidade-20.                             
       carrega-cidade-30.
           move     "true"             to      app-cidade-success-resp.
           move     "OK"               to      app-cidade-message-resp.
           
       carrega-cidade-ex.
           exit.       
      *-----------------------------------------------------------------
       carrega-crediario.
           initialize                  ws-carrega-crediario-resp.
           perform  notifica-erro-debito
                                       thru     notifica-erro-debito-ex.
           close    sce004. 
           close    sce002.                                      
           if       app-cred-tipo-in   equal        "H"
                    perform historico-crediario
                                       thru         hcrediario-ex
                    go                 carrega-crediario-ex.
                    
           initialize                  ws-carrega-crediario-resp.
           close    s003.
           open     input              s003.
           if       not valid-s003
                    perform            erro-estendido
                    move "false"       to      app-cred-success-resp
                    string
                    "Serviço Indisponível(ab-s003-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-cred-message-resp
                    go                 carrega-crediario-ex.
           close    sce004.
           open     I-O              sce004.
           if       not valid-sce004
                    perform            erro-estendido
                    move "false"       to      app-cred-success-resp
                    string
                    "Serviço Indisponível(ab-sce004-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-cred-message-resp
                    go                 carrega-crediario-ex.
           close    sce005.
           open     i-o              sce005.
           if       not valid-sce005
                    perform            erro-estendido
                    move "false"       to      app-cred-success-resp
                    string
                    "Serviço Indisponível(ab-sce005-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-cred-message-resp
                    go                 carrega-crediario-ex.
           close    s017.
           open     input              s017.
           if       not valid-s017
                    perform            erro-estendido
                    move "false"       to      app-cred-success-resp
                    string
                    "Serviço Indisponível(ab-s017-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-cred-message-resp
                    go                 carrega-crediario-ex.
           close    s717.
           open     input              s717.
           if       not valid-s717
                    perform            erro-estendido
                    move "false"       to      app-cred-success-resp
                    string
                    "Serviço Indisponível(ab-s717-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-cred-message-resp
                    go                 carrega-crediario-ex.
       carrega-crediario-05.                    
           copy     "cdatahj".
           string   
                    "t-car666"         delimited by size
                    hoje-data          delimited by size
                    aux-time1          delimited by size
                                       into         ne-s666.                    
           close    s666.
           open     output             s666.
           if       sta666             equal        "93"
                    go                 carrega-crediario-05.                
           if       not valid-s666
                    perform            erro-estendido
                    move "false"       to      app-cred-success-resp
                    string
                    "Serviço Indisponível(ab-s666-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-cred-message-resp
                    go                 carrega-crediario-ex.
           close    s207.
           open     input              s207.
           if       not valid-s207
                    perform            erro-estendido
                    move "false"       to      app-cred-success-resp
                    string
                    "Serviço Indisponível(ab-s207-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-cred-message-resp
                    go                 carrega-crediario-ex.
           move     app-cred-token-in  to           aux-token.
           move     aux-t3             to           7171codcl.
           read     s717  with         no lock.
           if       not valid-s717
                    initialize         7171cadas.
           if       app-cred-token-in  not equal    7171token
                    perform            erro-estendido
                    move "false"        to      app-cred-success-resp
                    string
                    "Token Inválido, Você será Desconectado."
                                       delimited by size
                                       into    app-cred-message-resp
                    move "false"       to           app-cred-token-resp                                       
                    go                 carrega-crediario-ex.

           move     7171codcl          to           0171codcl.
           read     s017   with        no lock.
           if       not valid-s017
                    perform            erro-estendido
                    move "false"       to      app-cred-success-resp
                    string
                    "Serviço Indisponível(ac-s017-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-cred-message-resp
                    go                 carrega-crediario-ex.
           move     0171codcl          to           aux-numcl
           move     0171digcl          to           aux-digcl.
           move     aux-codcl          to           2072codcl
           move     zeros              to           2072codfl               
           move     spaces             to           2071codca
           start    s207  key is       not less     2072chave
           if       not valid-s017
                    perform            erro-estendido
                    move "false"       to      app-cred-success-resp
                    string
                    "Serviço Indisponível(st-s207-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-cred-message-resp
                    go                 carrega-crediario-ex.
           close    s666.
           open     i-o                s666.                    
       carrega-crediario-10.
           read     s207 next with     no lock      at end 
                    go                 carrega-crediario-30.
           if       2071codcl          not equal    aux-codcl
                    go                 carrega-crediario-30.
           move     2071codfl          to           6661codfl.
           move     2071codcl          to           6661codcl.
           move     2071codca          to           6661codca.
           move     zeros              to           i.
       carrega-crediario-20.
           add      1                  to           i.
           if       i                  greater      24
                    go                 carrega-crediario-10.
           if       2071valor (i)      =            zeros
                    go                 carrega-crediario-10.
           move     zeros              to           j totre.
           perform  somare             5            times. 
           if       totre              not less     2071valor (i)
                    go                 carrega-crediario-20.                                 
           move     i                  to           6661numpr.
           move     2071valor (i)      to           6661valor.
           subtract totre              from         6661valor.    
           move     2071venci (i)      to           6661venci
                                                    aux-data.
           move     aux-dia            to           6661diave
                                                    inv-dia
           move     aux-mes            to           6661mesve
                                                    inv-mes
           move     aux-ano            to           6661anove
                                                    inv-ano.
           write    6661cadas.
           go       carrega-crediario-20.
       carrega-crediario-30.
           move     "true"             to         app-cred-token-resp.             
           initialize                  app-cred-success-resp.                 
           perform  monta-parcelas     thru         mparcelas-ex.
           close    s666.
           open     output             S666.
           CLOSE    S666.
           move     spaces             to           aux-caminho.
           string
                    "/usr/share/tomcat9/webapps/servicecomercial/"
                                       delimited by size
                    ne-s666            delimited by "    "
                    ".dat"             delimited by size
                                       into         aux-caminho.                                       
           call     "c$delete"         using        aux-caminho.

           string
                    "/usr/share/tomcat9/webapps/servicecomercial/"
                                       delimited by size
                    ne-s666            delimited by "    "
                    ".idx"             delimited by size
                                       into         aux-caminho.                                       
           call     "c$delete"         using        aux-caminho.
           MOVE     "True"             to         app-cred-success-resp.
           move     "OK"               to         app-cred-message-resp.
           move     "true"             to         app-cred-token-resp.             
       carrega-crediario-ex.
           exit.   
      *-----------------------------------------------------------------
       somare.
           add      1                  to           j.
           add      2071valre (i j)    to           totre.
      *-----------------------------------------------------------------
       verifica-percentual.
           if       i-juresp           equal        1
                    exit               paragraph.
           if       wdias              greater      90
           and      wdias              less         181
                    move 1             to           i-juresp
                    move 13.00         to           aux-perjur
           else
           if       wdias              greater      180
           and      wdias              less         366
                    move 1             to           i-juresp
                    move 8.40          to           aux-perjur
           else
           if       wdias              greater      365
           and      wdias              less         731
                    move 1             to           i-juresp
                    move 2.50          to           aux-perjur
           else
           if       wdias              greater      730
           and      wdias              less         1461
                    move 1             to           i-juresp
                    move 1.99          to           aux-perjur
           else
           if       wdias              greater      1460
           and      wdias              less         1825
                    move 1             to           i-juresp
                    move 1.50          to           aux-perjur
           else
           if       wdias              greater      1824
                    move 1             to           i-juresp
                    move 1.00          to           aux-perjur.
      *-----------------------------------------------------------------
       verifica-sce012.
           copy     "cdatahj".
           move     hj-dia             to           inv-dia.
           move     hj-mes             to           inv-mes.
           move     hj-ano             to           inv-ano.
           close    sce012.
           open     i-o                sce012.
           if       not valid-sce012
                    go                 vsce012-ex.
           initialize                  sce012-reg.                      
           move     aux-codcl          to           sce012-codcl.
           start    sce012  key is     not less     key01
                    invalid            go           vsce012-ex.
       vsce012-10.
           read     sce012  next  with no lock      at end
                    go                 vsce012-ex.
           if       not valid-sce012
                    go                 vsce012-ex.
           if       aux-codcl          not equal    sce012-codcl
                    go                 vsce012-ex.
           if       inv-data           less         sce012-datini
                    go                 vsce012-10.                        
           if       inv-data           greater      sce012-datfin
                    go                 vsce012-10. 
           if       sce012-numord      not equal    zeros
                    go                 vsce012-10.                                         
           move     sce012-juros       to           aux-tx-ajustada.
           if       i-sce012           equal        1
                    move sce004-numord to           sce012-numord
                    rewrite            sce012-reg.                                     
       vsce012-ex.
           exit.
      *-----------------------------------------------------------------
       monta-parcelas.
           move     zeros              to           jur-juresp
                                                    jur-taxa.
       
           move     zeros              to           aux-tx-ajustada
                                                    i-sce012
                                                    i-juresp.
           perform  verifica-sce012    thru         vsce012-ex.
           close    s666.
           open     input              s666.
           move     zeros              to           abe.
       tela3c.
           read     s666 next  with    no lock      at end
                    go                 mparcelas-ex.
           move     6661codca          to           2071codca.
           move     6661codcl          to           2071codcl.
           move     6661codfl          to           2071codfl.
       tela4.
           read     s207 with          no lock
           if       not valid-s207
                    go                 tela3c.
           copy     "cdatahj".
           move     hj-dia             to           aux-dia
           move     hj-mes             to           aux-mes
           move     hj-ano             to           aux-ano.
           move     6661numpr          to           i.
           move     zeros              to           j 
                                                    totre
           perform  somare             5            times.
           move     2071venci(i)       to           col-vencimento.
           compute  valnc              =            2071valor(i) 
                                       -            totre.
           move     hj-dia             to           aux-dia
           move     hj-mes             to           aux-mes
           move     hj-ano             to           aux-ano
           move     zeros              to           acres 
                                                    wdias. 
           move     2071venci(i)       to           aux-data.
           move     aux-data           to           dtini.
           
           move     aux-dia            to           inv-dia.
           move     aux-mes            to           inv-mes.
           move     aux-ano            to           inv-ano.
           
           
           move     hoje-data          to           dtfin.
           move     zeros              to           qtdia.
           call     "qtdia"            using        param-qtdia.
           cancel   "qtdia".
           if       qtdia              less         zeros
                    move zeros         to           wdias
                                                    atraso
           else
                    move qtdia         to           wdias
                                                    atraso.  
                                                    
           move     valnc              to           jur-capital
           move     wdias              to           jur-tempo
           move     "N"                to           jur-folha
           if       0171folha          >            0
                    move "S"           to           jur-folha.                 

           IF       AUX-TX-AJUSTADA    NOT EQUAL    ZEROS
                    move AUX-TX-AJUSTADA to         jur-taxa
                    move 1             to           jur-juresp.

           call     "cjuros".
           cancel   "cjuros".                                                    

           move     jur-juros          to           acres.
           add      jur-multa          to           acres.

           move     2071codca          to           col-carne.
           move     2071codfl          to           col-filia
           move     2071venci (i)      to           col-vencimento.
           move     i                  to           aux-numpar.
           move     zeros              to           j.
       ler-numpar.
           add      1                  to           j.
           if       j                  >            24
                    subtract 1         from         j
                    go                 sai-numpar.
           if       2071valor(j)       =            zeros
                    subtract 1         from         j
                    go                 sai-numpar.
           go       ler-numpar.
       sai-numpar.
           move     "/"                to           aux-barra.
           move     j                  to           aux-plano.
           move     aux-parcelamento   to           col-parcela.
           move     valnc              to           col-vlprest.
           move     wdias              to           col-atraso.
           move     acres              to           col-acresc.

           add      1                  to           abe.
           
           move     spaces             to      app-cre-status-resp(abe)
                                                    aux-urlboleto.     
           move     zeros              to           i-ord.
           perform  consiste-ordem     thru         cordem-ex.
           if       i-ord              equal        1
                    move "P"           to      app-cre-status-resp(abe).
           
           
           move     function trim(COL-CARNE)        to 
                                       app-cre-numeroCarne-resp(abe)
           move     function trim(COL-FILIA)        to   
                                       app-cre-filial-resp(abe)
           move     function trim(COL-PARCELA)      to  
                                       app-cre-parcela-resp(abe)
           move     COL-VENCIMENTO     to  
                                       app-cre-vencimento-resp(abe)
           move     function trim(COL-ATRASO)       to   
                                       app-cre-atraso-resp(abe)
           move     function trim(COL-VLPREST)      to  
                                       app-cre-vlprest-resp(abe)
           move     function trim(COL-ACRESC)       to 
                                       app-cre-acrescimo-resp(abe)
           compute  aux-valor rounded  =            valnc
                                       +            acres.
           move     aux-valor          to           col-total                                                                            
           move     function trim(COL-TOTAL)        to    
                                       app-cre-total-resp(abe).
           move     function trim(aux-urlboleto)
                                       to app-cre-urlboleto-resp(abe).                                       
           go       tela3c.       
       mparcelas-ex.
           exit.
      *-----------------------------------------------------------------
       consiste-ordem.  
           initialize                  sce005-reg
                                       aux-urlboleto.
           move     6661codca          to           sce005-codca.
           move     6661codcl          to           sce005-codcl.
           move     6661codfl          to           sce005-filia.
           move     zeros              to           sce005-numord.
           start    sce005  key is     not less     key01
                    invalid            go           cordem-ex.                          
       cordem-10.
           read     sce005 next  with  no lock      at end
                    go                 cordem-ex.
           if       not valid-sce005
                    perform            erro-estendido
                    move "false"       to      app-cred-success-resp
                    string
                    "Serviço Indisponível(ac-sce005-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-cred-message-resp
                    go                 cordem-ex.
           if       6661codcl          not equal    sce005-codcl                          
                    go                 cordem-ex.
           if       6661codfl          not equal    sce005-filia
                    go                 cordem-ex.
           if       6661codca          not equal    sce005-codca          
                    go                 cordem-ex.
           if       6661numpr          not equal    sce005-numpr
                    go                 cordem-10.
           move     sce005-numord      to           sce004-numord.
           read     sce004  with       no lock.
           if       not valid-sce004
                    perform            erro-estendido
                    move "false"       to      app-cred-success-resp
                    string
                    "Serviço Indisponível(ac-sce004-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-cred-message-resp
                    go                 cordem-ex.
           if       not (sce004-staord = "A" or "P")
                    go                 cordem-10.
           move     1                  to           i-ord.  
           move     sce004-urlboleto   to           aux-urlboleto.                                                                              
       cordem-ex.
           exit.                    
      *-----------------------------------------------------------------
      
       historico-crediario.
           initialize                  ws-carrega-crediario-resp.
           
           close    s017.
           open     input              s017.
           if       not valid-s017
                    perform            erro-estendido
                    move "false"       to      app-cred-success-resp
                    string
                    "Serviço Indisponível(ab-s017-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-cred-message-resp
                    go                 hcrediario-ex.
           close    s717.
           open     input              s717.
           if       not valid-s717
                    perform            erro-estendido
                    move "false"       to      app-cred-success-resp
                    string
                    "Serviço Indisponível(ab-s717-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-cred-message-resp
                    go                 hcrediario-ex.
           
           close    s207a.
           open     input              s207a.
           if       not valid-s207a
                    perform            erro-estendido
                    move "false"       to      app-cred-success-resp
                    string
                    "Serviço Indisponível(ab-s207a-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-cred-message-resp
                    go                 hcrediario-ex.
           
           close    s207h.
           open     input              s207h.
           if       not valid-s207h
                    perform            erro-estendido
                    move "false"       to      app-cred-success-resp
                    string
                    "Serviço Indisponível(ab-s207h-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-cred-message-resp
                    go                 hcrediario-ex.
           
           
           move     app-cred-token-in  to           aux-token.
           move     aux-t3             to           7171codcl.
           read     s717  with         no lock.
           if       not valid-s717
                    initialize         7171cadas.
           if       app-cred-token-in  not equal    7171token
                    perform            erro-estendido
                    move "false"        to      app-cred-success-resp
                    string
                    "Token Inválido, Você será Desconectado."
                                       delimited by size
                                       into    app-cred-message-resp
                    move "false"       to           app-cred-token-resp                                       
                    go                 hcrediario-ex.

           move     7171codcl          to           0171codcl.
           read     s017   with        no lock.
           if       not valid-s017
                    perform            erro-estendido
                    move "false"       to      app-cred-success-resp
                    string
                    "Serviço Indisponível(ac-s017-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-cred-message-resp
                    go                 hcrediario-ex.
           move     "a-hismca"         to           ne-s107.             
       hcrediario-10.
           close    s107.
           open     input              s107.
           if       not valid-s107
               if   ne-s107            equal        "a-hismca"
                    move "a-mca107"    to           ne-s107
                    go                 hcrediario-10
               else                                     
                    perform            erro-estendido
                    move "false"       to      app-cred-success-resp
                    string
                    "Serviço Indisponível(ab-s107-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-cred-message-resp
                    go                 hcrediario-ex.
                    
           move     0171codcl          to           aux-numcl
           move     0171digcl          to           aux-digcl.

           move     app-cred-datini-in to           ini-data.        
           move     app-cred-datfin-in to           fin-data.     
       
           initialize                  1073chave.
           move     aux-codcl          to           1073codcl.
           move     ini-ano            to           1073anomo.
           move     ini-mes            to           1073mesmo.
           move     ini-dia            to           1073diamo.
           start    s107  key is       not less     1073chave
           if       not valid-s107
               if   ne-s107            equal        "a-hismca"
                    move "a-mca107"    to           ne-s107
                    go                 hcrediario-10
               else                                     
                    perform            erro-estendido
                    move "false"       to      app-cred-success-resp
                    string
                    "Serviço Indisponível(st-s107-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-cred-message-resp
                    go                 hcrediario-ex.
           move     zeros              to           his.                    
       
       hcrediario-20.
           read     s107  next  with   no lock      at end
               if   ne-s107            equal        "a-hismca"
                    move "a-mca107"    to           ne-s107
                    go                 hcrediario-10
               else                                     
                    go                 hcrediario-30.
           if       not valid-s107
               if   ne-s107            equal        "a-hismca"
                    move "a-mca107"    to           ne-s107
                    go                 hcrediario-10
               else                                     
                    perform            erro-estendido
                    move "false"       to      app-cred-success-resp
                    string
                    "Serviço Indisponível(ac-s107-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-cred-message-resp
                    go                 hcrediario-ex.
           if       aux-codcl          not equal    1073codcl
               if   ne-s107            equal        "a-hismca"
                    move "a-mca107"    to           ne-s107
                    go                 hcrediario-10
               else                                     
                    go                 hcrediario-30.
           move     1073anomo          to           inv-ano
                                                    aux-ano.
           move     1073mesmo          to           inv-mes
                                                    aux-mes.
           move     1073diamo          to           inv-dia
                                                    aux-dia.
           if       inv-data           greater      fin-data
               if   ne-s107            equal        "a-hismca"
                    move "a-mca107"    to           ne-s107
                    go                 hcrediario-10
               else                                     
                    go                 hcrediario-30.
           if       1071tipom          not equal    "R"
                    go                 hcrediario-20.
                    
           move     1071codfl          to           2071codflh
           move     1071codcl          to           2071codclh.
           move     1071codca          to           2071codcah.
           read     s207h  with        no lock
           if       not valid-s207h
                    move 1071codfl     to           2071codfla
                    move 1071codcl     to           2071codcla
                    move 1071codca     to           2071codcaa
                    read s207a  with   no lock
                if  not valid-s207a
                    move zeros         to           aux-venci
                else
                    move 2071vencia(1071numpr)       
                                       to           aux-venci
           else                                           
                    move 2071vencih(1071numpr)       
                                       to           aux-venci.
           
                    
                    
           add      1                  to           his.                    
           move     function trim(1071codca) 
                                       to app-his-numeroCarne-resp(his).
           move     1071codfl          to           COL-FILIA.                                                                   
           move     function trim(COL-FILIA)        
                                       to app-his-filial-resp(his).   
           move     1071numpr          to app-his-parcela-resp(his)                             
           move     aux-venci          to app-his-vencimento-resp(his).     
           move     aux-data           to app-his-pagamento-resp(his).
           move     1071valor          to      COL-VLPREST
           move     function trim(COL-VLPREST)
                                       to app-his-valpago-resp(his).
           if       1071valju          greater      zeros
                    move 1071valju     to           COL-VLPREST
                    move function trim(COL-VLPREST)
                                       to app-his-acredesc-resp(his)
                    move "A"           to app-his-tipo-resp(his)
           else
           if       1071valde          greater      zeros
                    move 1071valde     to           COL-VLPREST
                    move function trim(COL-VLPREST)
                                       to app-his-acredesc-resp(his)
                    move "D"           to app-his-tipo-resp(his)
           else
                    move spaces        to app-his-acredesc-resp(his)
                                          app-his-tipo-resp(his).
           go       hcrediario-20.
       hcrediario-30.
           move     "True"             to      app-cred-success-resp.
           move     "True"             to      app-cred-token-resp.     
           move     "OK"               to      app-cred-message-resp.
                    
       hcrediario-ex.
           exit.
      *-----------------------------------------------------------------
       protocolo-assistencia.
           initialize                  ws-protocolo-assistencia-resp.
           close    s017.
           open     input              s017.
           if       not valid-s017
                    perform            erro-estendido
                    move "false"       to      app-prot-success-resp
                    string
                    "Serviço Indisponível(ab-s017-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-prot-message-resp
                    go                 protocolo-assistencia-ex.
           close    s717.
           open     input              s717.
           if       not valid-s717
                    perform            erro-estendido
                    move "false"       to      app-prot-success-resp
                    string
                    "Serviço Indisponível(ab-s717-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-prot-message-resp
                    go                 protocolo-assistencia-ex.
           close    s106.
           open     input              s106.
           if       not valid-s106
                    perform            erro-estendido
                    move "false"       to      app-prot-success-resp
                    string
                    "Serviço Indisponível(ab-s106-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-prot-message-resp
                    go                 protocolo-assistencia-ex.
           move     app-prot-token-in  to           aux-token.
           move     aux-t3             to           7171codcl.
           read     s717  with         no lock.
           if       not valid-s717
                    initialize         7171cadas.
           if       app-prot-token-in  not equal    7171token
                    perform            erro-estendido
                    move "false"       to      app-prot-success-resp
                    string
                    "Token Inválido, Você será Desconectado."
                                       delimited by size
                                       into    app-prot-message-resp
                    move "false"       to           app-prot-token-resp                                       
                    go                 protocolo-assistencia-ex.
           move     "true"             to           app-prot-token-resp.                             
           move     7171codcl          to           0171codcl.
           read     s017  with         no lock.
           if       not valid-s017                                                           
                    perform            erro-estendido
                    move "false"       to      app-prot-success-resp
                    string
                    "Serviço Indisponível(ac-s017-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-prot-message-resp
                    go                 protocolo-assistencia-ex.
           move     0171codcl          to           aux-numcl.
           move     0171digcl          to           aux-digcl.
           move     low-values         to          dci-where-constraint.
           string
                    '"1061codcl"='      delimited by size
                    aux-codcl          delimited by size
                                       into         dci-where-constraint       
           inspect  dci-where-constraint replacing trailing 
                    spaces             by           low-values.
           call     "dci_set_where_constraint" 
                                       using dci-where-constraint.
           initialize                  1061cadas.                                       
           start    s106  key is       not less     key01
           if       not valid-s106
                    perform            erro-estendido
                    move "false"       to      app-prot-success-resp
                    string
                    "Não foi Encontrado nenhuma Assistência(st-s106-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-prot-message-resp
                    move low-values    to          dci-where-constraint
                    call     "dci_set_where_constraint" 
                                       using dci-where-constraint
                    go                 protocolo-assistencia-ex.
           move     low-values         to          dci-where-constraint.
           call     "dci_set_where_constraint" 
                                             using dci-where-constraint.
           move     zeros              to           tam-prot.                                             
       
       protocolo-assistencia-10.
           read     s106  next  with   no lock      at end
                    go                 protocolo-assistencia-20.
           if       not valid-s106
                    perform            erro-estendido
                    move "false"       to      app-prot-success-resp
                    string
                    "Serviço Indisponível(ac-s106-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-prot-message-resp
                    go                 protocolo-assistencia-ex.
           add      1                  to           tam-prot.
           move     1061orige          to           col-filia.
           move     function trim(COL-FILIA)        to
                                       app-prot-filial-resp(tam-prot).
           move     1061proto          to           ed-proto.
           move     function trim(ed-proto)        to
                                      app-prot-nProtocolo-resp(tam-prot)
           move     1061dtmvt          to           inv-data.
           move     inv-dia            to           aux-dia.
           move     inv-mes            to           aux-mes.
           move     inv-ano            to           aux-ano.
           move     aux-data           to           
                                       app-prot-dtEmissao-resp(tam-prot)           
           move     function trim(1061descr)        to
                                       app-prot-produto-resp(tam-prot).
           go       protocolo-assistencia-10.                                             
       protocolo-assistencia-20.
           move     "true"             to         app-prot-success-resp.
           move     "OK"               to         app-prot-message-resp.
           move     "true"             to         app-prot-token-resp.
       protocolo-assistencia-ex.
           exit.
      *-----------------------------------------------------------------
       protocolo-detalhe.
           initialize                  ws-protocolo-detalhe-resp.
           close    s717.
           open     input              s717.
           if       not valid-s717
                    perform            erro-estendido
                    move "false"       to      app-det-success-resp
                    string
                    "Serviço Indisponível(ab-s717-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-det-message-resp
                    go                 protocolo-detalhe-ex.
           close    s106.
           open     input              s106.
           if       not valid-s106
                    perform            erro-estendido
                    move "false"       to      app-det-success-resp
                    string
                    "Serviço Indisponível(ab-s106-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-det-message-resp
                    go                 protocolo-detalhe-ex.
           close    s806.
           open     input              s806.
           if       not valid-s806
                    perform            erro-estendido
                    move "false"       to      app-det-success-resp
                    string
                    "Serviço Indisponível(ab-s806-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-det-message-resp
                    go                 protocolo-detalhe-ex.
           close    s816.
           open     input              s816.
           if       not valid-s816
                    perform            erro-estendido
                    move "false"       to      app-det-success-resp
                    string
                    "Serviço Indisponível(ab-s816-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-det-message-resp
                    go                 protocolo-detalhe-ex.
           move     app-det-token-in   to           aux-token.
           move     aux-t3             to           7171codcl.
           read     s717  with         no lock.
           if       not valid-s717
                    initialize         7171cadas.
           if       app-det-token-in   not equal    7171token
                    perform            erro-estendido
                    move "false"       to      app-det-success-resp
                    string
                    "Token Inválido, Você será Desconectado."
                                       delimited by size
                                       into    app-det-message-resp
                    move "false"       to           app-det-token-resp                                       
                    go                 protocolo-detalhe-ex.
           move     app-det-filial-in  to           1061orige.           
           move     app-det-nProt-in   to           1061proto.
           read     s106  with         no lock.
           if       not valid-s106
                    perform            erro-estendido
                    move "false"       to      app-det-success-resp
                    string
                    "Protocolo não Encontrado(ac-s106-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-det-message-resp
                    move "true"        to           app-det-token-resp                                       
                    go                 protocolo-detalhe-ex.
           move     1061dtmvt          to           inv-data.
           move     inv-dia            to           aux-dia.
           move     inv-mes            to           aux-mes.
           move     inv-ano            to           aux-ano.
           move     aux-data           to         app-det-abertura-resp.           
           move     function trim(1061descr)          
                                       to         app-det-produto-resp.
           move     function trim(1061defei)          
                                       to         app-det-defeito-resp.
           move     spaces             to         app-det-status-resp.
           if       1061stanf          equal        "X"
                    move "Encerrado"   to           app-det-status-resp
           else         
                    move "Aguardando Conserto" 
                                       to           app-det-status-resp.  
           move     zeros              to          app-det-fechada-resp.
       pdetalhe-10.
           copy     "cdatahj".
           string   
                    "t-det777"         delimited by size
                    hoje-data          delimited by size
                    aux-time1          delimited by size
                                       into         ne-s777.                    
           close    s777.
           open     output             s777.
           if       sta777             equal        "93"
                    go                 pdetalhe-10.                
           if       not valid-s777
                    perform            erro-estendido
                    move "false"       to      app-det-success-resp
                    string
                    "Serviço Indisponível(ab-s777-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-det-message-resp
                    move "true"        to           app-det-token-resp                                       
                    go                 protocolo-detalhe-ex.
           close    s777.
           open     i-o                s777.                    
           move     zeros              to           tam-eve.
           move     1061orige          to           8061orige
           move     1061proto          to           8061proto
           move     zeros              to           8061seque.
           start    s806  key is       not less     8061chave
                    invalid            go           pdetalhe-40.
           move     zeros              to           aux-dtdev.                               
       pdetalhe-20.
           read     s806  with         no lock      at end
                    go                 pdetalhe-40.
           if       not valid-s806
                    go                 pdetalhe-40.
           if       1061orige          not equal    8061orige
                    go                 pdetalhe-40.
           if       1061proto          not equal    8061proto
                    go                 pdetalhe-40.
           move     8061dtmvt          to           7771dtmvt.
           if       8061tipom          equal        350
                    move "Entrada na Filial para Conserto."
                                       to           7771evento
           else                            
           if       8061tipom          equal        351
              if    8061filnf          equal        1061orige        
                    move "Produto Transferido para Matriz."
                                       to           7771evento
              else
                    move "Produto Transferido para Filial."                         
                                       to           7771evento
           else
           if       8061tipom          equal        352 
                    move "Enviado para Assistência Autorizada."
                                       to           7771evento
           else
           if       8061tipom          equal        353 
                    move "Retorno da Assistência Autorizada."
                                       to           7771evento
           else
           if       8061tipom          equal        354
                    move "Produto Devolvido ao Cliente."
                                       to           7771evento
                    move 8061dtmvt     to           aux-dtdev.
           move     1                  to           7771seque.         
       pdetalhe-30.             
           write    7771cadas.
           if       sta777             equal        "22"
                    add 1              to           7771seque
                    go                 pdetalhe-30.
           go       pdetalhe-20.                          
       pdetalhe-40.
           initialize                  8161cadas.                   
           move     1061orige          to           8161orige
           move     1061orige          to           8161proto
           start    s816  key is       not less     8161chave
                    invalid            go           pdetalhe-70.
       pdetalhe-50.
           read     s816  next with    no lock      at end
                    go                 pdetalhe-70.
           if       not valid-s816
                    go                 pdetalhe-70.                                    
           if       1061orige          not equal    8161orige
                    go                 pdetalhe-70.
           if       1061proto          not equal    8161proto
                    go                 pdetalhe-70.
           move     8161dtmvt          to           7771dtmvt.
           move     function trim(816evento)        
                                       to           7771evento.
           move     1                  to           7771seque.
       pdetalhe-60.
           write    7771cadas.
           if       sta777             equal        "22"
                    add 1              to           7771seque
                    go                 pdetalhe-60.
           go       pdetalhe-50.                           
       pdetalhe-70.
           close    s777.
           open     input              s777.
           move     zeros              to           tam-eve.           
       pdetalhe-80.                        
           read     s777 next  with    no lock      at end
                    go                 pdetalhe-90.
           IF       NOT (STA777 = "00" OR "02")     
                    GO                 pdetalhe-90.                   
           ADD      1                  TO           tam-eve.                               
           MOVE     7771DTMVT          TO           INV-DATA.
           MOVE     SPACES             TO app-det-eventos-resp(tam-eve).
           STRING
                    INV-DIA            DELIMITED BY SIZE
                    "/"                DELIMITED BY SIZE
                    INV-MES            DELIMITED BY SIZE
                    "/"                DELIMITED BY SIZE
                    INV-ANO            DELIMITED BY SIZE
                    "-"                DELIMITED BY SIZE
                    7771EVENTO         DELIMITED BY "   "
                                     INTO app-det-eventos-resp(tam-eve).
           GO       pdetalhe-80.                 
       pdetalhe-90.
           if       aux-dtdev          greater      zeros
                    move aux-dtdev     to           inv-data
                    move inv-dia       to           aux-dia
                    move inv-mes       to           aux-mes
                    move inv-ano       to           aux-ano
                    move aux-data      to          app-det-fechada-resp.
                    
           move     spaces             to           aux-caminho.
           string
                    "/usr/share/tomcat9/webapps/servicecomercial/"
                                       delimited by size
                    ne-s777            delimited by "    "
                    ".dat"             delimited by size
                                       into         aux-caminho.                                       
           call     "c$delete"         using        aux-caminho.

           string
                    "/usr/share/tomcat9/webapps/servicecomercial/"
                                       delimited by size
                    ne-s777            delimited by "    "
                    ".idx"             delimited by size
                                       into         aux-caminho.                                       
           call     "c$delete"         using        aux-caminho.
                    
                    
                    
           MOVE     "True"             to           app-det-success-resp
                                                    app-det-token-resp.
           move     "OK"               to          app-det-message-resp.
       protocolo-detalhe-ex.
           exit.  
      *-----------------------------------------------------------------
       carrega-faq.
           initialize                  ws-carrega-faq-resp.
           close    sce001.
           open     input              sce001.
           if       not valid-sce001
                    perform            erro-estendido
                    move "false"       to      app-faq-success-resp
                    string
                    "Serviço Indisponível(ab-sce001-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-faq-message-resp
                    go                 carrega-faq-ex.
           move     1                  to           sce001-depto.
           move     zeros              to           sce001-categoria
                                                    sce001-sequencia.
           start    sce001   key is    not less     sce001-chave
           if       not valid-sce001
                    perform            erro-estendido
                    move "false"       to         app-faq-success-resp
                    string
                    "Não Foram Encontrados Registros de FAQ(st-sce001-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into       app-faq-message-resp
                    move "True"        to           app-faq-token-resp                                       
                    go                 carrega-faq-ex.
           move     zeros              to           cat per.
           move     zeros              to           co-categoria.                    
       cfaq-10.
           read     sce001 next with   no lock      at end
                    go                 cfaq-20.                               
           if       not valid-sce001
                    perform            erro-estendido
                    move "false"       to         app-faq-success-resp
                    string
                    "Não Foram Encontrados Registros de FAQ(st-sce001-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into       app-faq-message-resp
                    move "True"        to           app-faq-token-resp                                       
                    go                 carrega-faq-ex.
           if       not (sce001-categoria = 1 or 2 or 4 or 8)
                    go                 cfaq-10.
                    
           if       sce001-categoria   equal        1
                    move "Consertos"   to           xCategoria
           else                  
           if       sce001-categoria   equal        2
                    move "Comercial"   to           xCategoria      
           else                  
           if       sce001-categoria   equal        4
                    move "Crediário"   to           xCategoria    
           else                  
                    move "Seguros"     to           xCategoria.    
                    
                    
                    
           if       co-categoria       not equal    sce001-categoria
                    move sce001-categoria to        co-categoria
                    add 1              to           cat
                    move xCategoria    to  app-faq-xCategoria-resp(cat)
                    move zeros         to           per.                          
                                                        
           add      1                  to           per.                    
           move     function trim(sce001-pergunta)
                                       to       
                                       app-faq-pergunta-resp(cat per).        
           move     function trim(sce001-resposta)
                                       to       
                                       app-faq-resposta-resp(cat per).
           go       cfaq-10. 
       cfaq-20.
           move     "true"             to         app-faq-success-resp.
           move     "OK"               to         app-faq-message-resp.
           move     "true"             to         app-faq-token-resp. 
       carrega-faq-ex.
           exit.  
      *-----------------------------------------------------------------
       recupera-senha.
           initialize                  ws-recupera-senha-resp.
           close    s717.
           open     i-o                s717.
           if       not valid-s717
                    perform            erro-estendido
                    move "false"       to         app-rec-success-resp
                    string
                    "Serviço Indisponível(ab-s717-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into      app-rec-message-resp
                    go                 recupera-senha-ex.
           move     spaces             to           7171cpfcnpj.                    
           move     app-rec-cpfcnpj-in to           7171cpfcnpj.  
           read     s717 with no lock  key is       key01.
           if       not valid-s717
                    perform            erro-estendido
                    move "false"       to         app-rec-success-resp
                    string
                    "Você não Possui Senha a ser Redefinida(ac-s717-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into      app-rec-message-resp
                    go                 recupera-senha-ex.
           copy     "cdatahj".
           
           if       aux-min            equal        zeros
                    move 4             to           aux-min.
           if       aux-seg            equal        zeros
                    move 5             to           aux-seg.
           
           
           compute  aux-numero-senha   =            ((hj-dia
                                       +            hj-mes)
                                       *            aux-seg)
                                       +            (aux-seg
                                       *            7171codcl).
           move     zeros              to           i.
           move     spaces             to           rec-senha.
       rsenha-10.
           add      1                  to           i.
           if       i                  greater      8
                    go                 rsenha-20.
           move     zeros              to           idx.                    
           move     aux-numero-senha(i:1)
                                       to           idx(2:1).       
           if       idx                equal        zeros
                    move 1             to           idx. 
                    
           if       i                  equal        3
                    add 10             to           idx.                    
           if       i                  equal        4
                    add 20             to           idx.                    
           if       i                  equal        5
                    add 30             to           idx.                    
           if       i                  equal        7
                    add 20             to           idx.                    
           move     tsenha(idx)        to           rec-senha(i:1)
           go       rsenha-10.                       
       rsenha-20.
           MOVE     spaces             TO           REC-EMAIL
                                                    tab-email.
           move     7171email          to           tab-email.
           move     101                to           i.
           move     zeros              to           j.
       rsenha-30.
           subtract 1                  from         i
           if       i                  equal        zeros
                    go                 rsenha-40.
           if       tb-email(i)        equal        spaces
                    go                 rsenha-30.
           if       i                  equal        1                    
                    move tb-email(i)   to           rec-email(i:1)
                    go                 rsenha-30.
           if       j                  equal        zeros
                    move i             to           j                    
                    move tb-email(i)   to           rec-email(j:1)
                    go                 rsenha-30.
           if       tb-email(i)        equal        "@"
                    move i             to           j                    
                    move tb-email(i)   to           rec-email(j:1)
                    add 1              to           j
                    move tb-email(j)   to           rec-email(j:1)
                    go                 rsenha-30.
           if       tb-email(i)        equal        "."
                    move i             to           j                    
                    move tb-email(i)   to           rec-email(j:1)
                    add 1              to           j
                    move tb-email(j)   to           rec-email(j:1)
                    go                 rsenha-30.
           if       not (tb-email(i) = "-" or "_" or "." or "$" or "#"
                    or "!" or "*" or "&" or "(" or ")" or "+" or "=")
                    move "*"           to           rec-email(i:1).                                                          
           go       rsenha-30.                           
       rsenha-40.
           perform  enviar-email.
           if       app-rec-success-resp =          "false"
                    go                 recupera-senha-ex
           end-if.    
           move     "true"             to          app-rec-success-resp.
           move     "Senha Enviada para seu Email"
                                       to          app-rec-message-resp.
           move     function trim(rec-email)
                                       to           app-rec-email-resp.
           move     function trim(rec-senha)
                                       to           app-rec-senha-resp.
           move     app-rec-senha-resp to           7171senapp
           rewrite  7171cadas.
           if       not valid-s717
                    perform            erro-estendido
                    move "false"       to         app-rec-success-resp
                    string
                    "Erro ao atualizar a senha(ac-s717-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into      app-rec-message-resp.
           
                                                                                   
       recupera-senha-ex.
           exit.  
       enviar-email.
           move     spaces             to           wrk-throwable
                                                    wkr-msg-email.           
           try
           move     "email/email_notify.html"  to    wkr-msg-email     
           set      arq_html           to           
                    JFile:>new(wkr-msg-email)      
           set      doc_html           to
                                       Jsoup:>parse(arq_html, "UTF-8")                    
           set      conteudoEmailString to          
                                       JString:>new(doc_html:>html())
           string   url-senha rec-senha into aux-url-senha
           set      conteudoEmailString to
                    conteudoEmailString:>replaceAll(
                    "variavel_senha", aux-url-senha)                                                           
           set      prop               to
                                       JSystem:>getProperties()
           prop:>setProperty("mail.smtp.host", "true")
           prop:>setProperty("mail.smtp.starttls.enable", "true")
           prop:>setProperty("mail.smtp.host", "smtp.gmail.com")
           prop:>setProperty("mail.smtp.port", "587")
           prop:>setProperty("mail.smtp.auth", "true")
           prop:>setProperty("mail.smtp.ssl.protocols", "TLSv1.2")
           prop:>setProperty("mail.smtp.ssl.trust", "smtp.gmail.com")

           set      autenticador       to           
                    MailAuthenticator:>new(
                    "noreply@lojasolar.com.br", 
                    "bpntgbciolukcbtd")        
           set      objSession         to           
                    Session:>getInstance(prop, autenticador)         
           objSession:>setDebug(false)
           
           set      mp                 to           MimeMultipart:>new
           set      mensagem           to           
                                       MimeMessage:>new(objSession)
           set      enderecoPara       to           
                    InternetAddress:>new(7171email)
           set      enderecoDe         to           
                    InternetAddress:>new("noreply@lojasolar.com.br")         
           mensagem:>setSubject("Lojas Solar - Recuperação de senha")
           mensagem:>setFrom(enderecoDe)
           mensagem:>addRecipient(
                    autenticador:>getMessageRecipientType(), 
                    enderecoPara)
           
           set      mbp                to           MimeBodyPart:>new()
           mbp:>setContent(
                    conteudoEmailString 
                    JString:>new("text/html; charset=UTF-8"))
           mp:>addBodyPart(mbp)
           mensagem:>setContent(mp)
           Transport:>send(mensagem)
           
           catch exception
                    set wkr-msg-email  to           
                                       exception-object:>toString()
                    move "false"       to           app-rec-success-resp
                    move wkr-msg-email to           app-rec-message-resp
           end-try.
           
       limpa-numeros.
           add      1                  to           i.
           if       i                  greater      100
                    go                 lnumeros-ex.
           if       not (ws-d (i) = "0" or "1" or "2" or "3" or "4"
                                 or "5" or "6" or "7" or "8" or "9")
                    go                 limpa-numeros.
           add      1                  to           j.
           move     ws-d (i)           to           wk-d (j).
           go       limpa-numeros.                                                                                              
       lnumeros-ex.
           exit.
      *-----------------------------------------------------------------
       tira-carac-especiais.
           set      aux-string         to           
                                       aux-string:>replaceAll("Ã", "A").         
           set      aux-string         to           
                                       aux-string:>replaceAll("Á", "A").         
           set      aux-string         to           
                                       aux-string:>replaceAll("Â", "A").         
           set      aux-string         to           
                                       aux-string:>replaceAll("À", "A").         
           set      aux-string         to           
                                       aux-string:>replaceAll("É", "E").         
           set      aux-string         to           
                                       aux-string:>replaceAll("Ê", "A").         
           set      aux-string         to           
                                       aux-string:>replaceAll("Í", "I").         
           set      aux-string         to           
                                       aux-string:>replaceAll("Î", "I").         
           set      aux-string         to           
                                       aux-string:>replaceAll("Ì", "I").         
           set      aux-string         to           
                                       aux-string:>replaceAll("Ó", "O").         
           set      aux-string         to           
                                       aux-string:>replaceAll("Ô", "O").         
           set      aux-string         to           
                                       aux-string:>replaceAll("Õ", "O").         
           set      aux-string         to           
                                       aux-string:>replaceAll("Ò", "O").         
           set      aux-string         to           
                                       aux-string:>replaceAll("Ú", "U").         
           set      aux-string         to           
                                       aux-string:>replaceAll("Ù", "U").         
           set      aux-string         to           
                                       aux-string:>replaceAll("Û", "U").         
           set      aux-string         to           
                                       aux-string:>replaceAll("ç", "C").         
           set      aux-string         to           
                                       aux-string:>replaceAll("Ç", "C").         
           set      aux-string         to           
                                       aux-string:>replaceAll("/", "").         
           set      aux-string         to           
                                       aux-string:>replaceAll(",", "").         
           set      aux-string         to           
                                       aux-string:>replaceAll(".", "").         
           set      aux-string         to           
                                       aux-string:>replaceAll(".", "").         
           set      aux-string         to           
                                       aux-string:>replaceAll("(", "").         
           set      aux-string         to           
                                       aux-string:>replaceAll(")", "").         
           set      aux-string         to           
                                       aux-string:>replaceAll(":", "").         
           set      aux-string         to           
                                       aux-string:>replaceAll(";", "").         
           set      aux-string         to           
                                       aux-string:>replaceAll("+", "").
           set      0172nomcl          to           aux-string.
           go       opagamento-50.                               
      *-----------------------------------------------------------------                                 
       limpa-espacos.
           move     zeros              to           i j i-esp.
           move     spaces             to           wk-dados.
       lespacos-10.
           add      1                  to           i.
           if       i                  greater      100
                    go                 lespacos-ex.
           if       ws-d(i)            equal        spaces
           and      j                  equal        zeros
                    go                 lespacos-10.
           IF       (WS-D(I) = "/" or "," or "." OR "(" OR ")" or ":"
                     or ";" OR "+")
                    move spaces        to           WS-D(I). 
           IF       (WS-D(I) = "Ã" or "Ã" or "Á" or "Â" OR "À" or
                               "ã" or "ã" or "á" or "â" OR "à")
                    move "A"           to           WS-D(I). 
           IF       (WS-D(I) = "É" or "Ê" OR "é" or "ê")
                    move "E"           to           WS-D(I). 
           IF       (WS-D(I) = "Í" or "Î" OR "Ì" or "í" or "î" OR "ì")
                    move "I"           to           WS-D(I). 
           IF       (WS-D(I) = "Ó" or "Ô" OR "Õ" OR "Ò" or
                               "ó" or "ô" OR "õ" OR "ò")
                    move "O"           to           WS-D(I). 
           IF       (WS-D(I) = "Ú" or "Ù" OR "Û" or "ú" or "ù" OR "û")
                    move "U"           to           WS-D(I). 
           IF       (WS-D(I) = "ç" or "Ç")
                    move "C"           to           WS-D(I). 
                    
                              
           if       ws-d(i)            equal        spaces
           and      i-esp              equal        1
                    go                 lespacos-10.
           if       ws-d(i)            equal        spaces
                    move 1             to           i-esp                                                                                  
                    add  1             to           j
                    move ws-d (i)      to           wk-d (j)
                    go                 lespacos-10.                
           add      1                  to           j
           move     ws-d (i)           to           wk-d (j).
           move     zeros              to           i-esp
           go       lespacos-10.
       lespacos-ex.
           exit.                    
      *-----------------------------------------------------------------
       historico-compras.
           initialize                  ws-historico-compras-resp.
           move     zeros              to           nf.  
           close    s003.
           open     input              s003.
           if       not valid-s003
                    perform            erro-estendido
                    move "false"       to      app-hist-success-resp
                    string
                    "Serviço Indisponível(ab-s003-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-hist-message-resp
                    go                 historico-compras-ex.
           close    s017.
           open     input              s017.
           if       not valid-s017
                    perform            erro-estendido
                    move "false"       to      app-hist-success-resp
                    string
                    "Serviço Indisponível(ab-s017-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-hist-message-resp
                    go                 historico-compras-ex.
           close    s105.
           open     input              s105.
           if       not valid-s105
                    perform            erro-estendido
                    move "false"       to      app-hist-success-resp
                    string
                    "Serviço Indisponível(ab-s105-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-hist-message-resp
                    go                 historico-compras-ex.
           close    s717.
           open     input              s717.
           if       not valid-s717
                    perform            erro-estendido
                    move "false"       to      app-hist-success-resp
                    string
                    "Serviço Indisponível(ab-s717-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-hist-message-resp
                    go                 historico-compras-ex.
           move     app-hist-token-in  to           aux-token.
           move     aux-t3             to           7171codcl.
           read     s717  with         no lock.
           if       not valid-s717
                    initialize         7171cadas.
           if       app-hist-token-in  not equal    7171token
                    perform            erro-estendido
                    move "false"       to      app-hist-success-resp
                    string
                    "Token Inválido, Você será Desconectado."
                                       delimited by size
                                       into    app-hist-message-resp
                    move "false"       to           app-hist-token-resp                                       
                    go                 historico-compras-ex.
                    
           move     7171codcl          to           0171codcl.
           read     s017  with         no lock.
           if       not valid-s017                                                           
                    perform            erro-estendido
                    move "false"       to      app-hist-success-resp
                    string
                    "Serviço Indisponível(ac-s017-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-hist-message-resp
                    go                 historico-compras-ex.
           move     zeros              to           nf.  

           move     app-hist-datini-in to           ini-data.
           move     app-hist-datfin-in to           fin-data.
           move     0171codcl          to           aux-numcl.
           move     0171digcl          to           aux-digcl.
           move     low-values         to          dci-where-constraint.
           string
                    '"1053codcl"='      delimited by size
                    aux-codcl          delimited by size
                                       into         dci-where-constraint       
           inspect  dci-where-constraint replacing trailing 
                    spaces             by           low-values
           call     "dci_set_where_constraint" 
                                       using dci-where-constraint.
           move     31                 to           fin-dia.
           initialize                  1052chave.
           move     1                  to           1052depto.
           move     ini-ano            to           1052anoem
           move     ini-mes            to           1052mesem
           move     1                  to           1052diaem
                                                    ini-dia.
           start    s105  key is       not less     1052chave
           if       not valid-s105
                    move low-values    to          dci-where-constraint
                    call     "dci_set_where_constraint" 
                                       using dci-where-constraint
                    go                 historico-compras-20.
           move     low-values         to          dci-where-constraint.
           call     "dci_set_where_constraint" 
                                             using dci-where-constraint.
           move     zeros              to           nf.  
       historico-compras-10.
           read     s105 next with     no lock      at end
                    go                 historico-compras-20.
           if       not valid-s105                                                                                            
                    perform            erro-estendido
                    move "false"       to      app-hist-success-resp
                    string
                    "Problema ao selecionar Compras do Período(ac-s105-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-hist-message-resp
                    go                 historico-compras-ex.
           move     1052anoem          to           inv-ano.
           move     1052mesem          to           inv-mes.
           move     1052diaem          to           inv-dia.
           if       inv-data           greater      fin-data
                    go                 historico-compras-20.
           if       1051depto          not equal    1
                    go                 historico-compras-20.   
                    
           if       1051situa          equal        "A"
                    go                 historico-compras-10.                                                                 

           MOVE     1051TIPOM          TO           0031CODIG.
           MOVE     6                  TO           0031IDENT.
           READ     S003  WITH         NO LOCK.
           IF       NOT VALID-S003
                    GO                 historico-compras-10.
           IF       0031LETBI          NOT EQUAL    "V"
                    GO                 historico-compras-10.                                              
                               
           add      1                  to           nf.
           move     1051numnf          to           ed-numnf.
           move     function trim(ed-numnf)
                                       to app-hist-numeroNota-resp(nf).          
           
           move     1051orige          to           ed-filial.
           move     function trim(ed-filial)
                                       to app-hist-filial-resp(nf).
           move     function trim(1051serie)
                                       to app-hist-serie-resp(nf).                                     

           move     1051datem          to app-hist-dataNota-resp(nf).
           move     1051total          to           ed-total.
           move     function trim(ed-total)
                                       to  app-hist-valor-resp(nf).
           go       historico-compras-10.                                             
       historico-compras-20.
                    move "True"        to      app-hist-success-resp
                    move "OK"          to    app-hist-message-resp
                    move "True"        to      app-hist-token-resp.
                    
       
       historico-compras-ex.
           exit.  
      *-----------------------------------------------------------------
       historico-itens.
           initialize                  ws-historico-itens-resp.
           close    s717.
           open     input              s717.
           if       not valid-s717
                    perform            erro-estendido
                    move "false"       to      app-itens-success-resp
                    string
                    "Serviço Indisponível(ab-s717-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-itens-message-resp
                    go                 historico-itens-ex.
           move     app-itens-token-in to           aux-token.
           move     aux-t3             to           7171codcl.
           read     s717  with         no lock.
           if       not valid-s717
                    initialize         7171cadas.
           if       app-itens-token-in not equal    7171token
                    perform            erro-estendido
                    move "false"       to      app-itens-success-resp
                    string
                    "Token Inválido, Você será Desconectado."
                                       delimited by size
                                       into    app-itens-message-resp
                    move "false"       to           app-itens-token-resp                                       
                    go                 historico-itens-ex.
           close    s405.
           open     input              s405.
           if       not valid-s405
                    perform            erro-estendido
                    move "false"       to      app-itens-success-resp
                    string
                    "Serviço Indisponível(ab-s405-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-itens-message-resp
                    go                 historico-itens-ex.

           move     1                  to           4051depto.
           move     app-itens-numero-in to          4051numnf            
           move     app-itens-filial-in to          4051orige
           move     app-itens-serie-in  to          4051serie
           move     zeros              to           4051seque.
           start    s405  key is       not less     4051chave
           if       not valid-s405
                    perform            erro-estendido
                    move "false"       to      app-itens-success-resp
                    string
                   "Itens da Nota Fiscal não foram Localizados(st-s405-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-itens-message-resp
                    go                 historico-itens-ex.
           move     zeros              to           it.                    
       historico-itens-10.
           read     s405  next with    no lock      at end
                    go                 historico-itens-20.
           if       not valid-s405                                                 
                    perform            erro-estendido
                    move "false"       to      app-itens-success-resp
                    string
                    "Problema ao selecionar Itens da Nota(ac-s405-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-itens-message-resp
                    go                 historico-itens-ex.
           if       4051numnf          not equal    app-itens-numero-in
                    go                 historico-itens-20.
           if       4051orige          not equal    app-itens-filial-in
                    go                 historico-itens-20.
           if       4051serie          not equal    app-itens-serie-in
                    go                 historico-itens-20.
                    
           add      1                  to           it.                    
           move     4051itens          to           ed-itens
           move     function trim(ed-itens)
                                       to app-itens-codigo-resp(it).
           move     function trim(4051descr)
                                       to app-itens-descricao-resp(it).
           move     4051quant          to           ed-quant
           move     function trim(ed-quant)
                                       to app-itens-quant-resp(it).
           move     4051unita          to           ed-unitario.
           move     function trim(ed-unitario)
                                       to app-itens-unitario-resp(it).
           
           compute  4051unita          =            4051quant
                                       *            4051unita.                                       
           move     4051unita          to           ed-total
           move     function trim(ed-total)
                                       to app-itens-total-resp(it).
           string
                  "http://frotas.gruposolar.com.br:8080/imagens/"
                                       delimited by size
                   app-itens-codigo-resp(it) delimited by size
                   "/1.jpg"            delimited by size
                                       into app-itens-imagem-resp(it).
           go       historico-itens-10.                          
       historico-itens-20.
           if       it                 equal        zeros
                    move "false"       to      app-itens-success-resp
                    string
                    "Não foram Localizadas Compras no Período."
                                       delimited by size
                                       into    app-itens-message-resp
                    move "True"        to      app-itens-token-resp
           else                                                    
                    move "True"        to      app-itens-success-resp
                    move "OK"          to    app-itens-message-resp
                    move "True"        to      app-itens-token-resp.
                    
       
       historico-itens-ex.
           exit.  
      *-----------------------------------------------------------------
       carrega-lojas.
           initialize                  ws-carrega-lojas-resp.
           close    s003.
           open     input              s003.
           if       not valid-s003
                    perform            erro-estendido
                    move "false"       to      app-lojas-success-resp
                    string
                    "Serviço Indisponível(ab-s003-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-lojas-message-resp
                    go                 carrega-lojas-ex.

           close    s003a.
           open     input              s003a.
           if       not valid-s003a
                    perform            erro-estendido
                    move "false"       to      app-lojas-success-resp
                    string
                    "Serviço Indisponível(ab-s003a-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-lojas-message-resp
                    go                 carrega-lojas-ex.
                    
           move     app-lojas-latitude-in           to  aux-latitude
           move     app-lojas-longitude-in          to  aux-longitude

           move     low-values         to          dci-where-constraint.
           string
                    '"0031ident"= 7'      delimited by size
                                       into         dci-where-constraint       
           inspect  dci-where-constraint replacing trailing 
                    spaces             by           low-values.
           call     "dci_set_where_constraint" 
                                       using dci-where-constraint.
           move     spaces             to           0032descr
           start    s003  key is       not less     0032chave
           if       not valid-s003
                    perform            erro-estendido
                    move "false"       to      app-lojas-success-resp
                    string
                    "Serviço Indisponível(st-s003-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-lojas-message-resp
                    move low-values    to          dci-where-constraint
                    call "dci_set_where_constraint" 
                                       using dci-where-constraint
                    go                 carrega-lojas-ex.
           move     low-values         to          dci-where-constraint.
           call     "dci_set_where_constraint" 
                                       using dci-where-constraint.

           move     zeros              to           lj.                    
                    
       carrega-lojas-10.
           read     s003  next  with   no lock      at end
                    go                 carrega-lojas-20.
           if       not valid-s003
                    perform            erro-estendido
                    move "false"       to      app-lojas-success-resp
                    string
                    "Serviço Indisponível(ac-s003-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-lojas-message-resp
                    go                 carrega-lojas-ex.
           if       0031ident          not equal    7
                    go                 carrega-lojas-20.
           if       0031depto          not equal    1
                    go                 carrega-lojas-10.
           if       0031tpesp          equal        "1"
                    go                 carrega-lojas-10.
           move     0031chave          to           003achave.
           read     s003a  with        no lock.
           if       not valid-s003a
                    go                 carrega-lojas-10.
           if       0031nomger         equal        spaces
                    go                 carrega-lojas-10.
           add      1                  to           lj.



           string   
                    0031cidfl          delimited by "   "
                    " - "              delimited by size
                    0031estfl          delimited by size
                                  into       app-lojas-cidade-resp(lj).
           move     0031natop          to           aux-numer.                                  
           string
                    0031endfl          delimited by "   "
                    ", "               delimited by size
                    aux-numer          delimited by "  "
                                   into     app-lojas-endereco-resp(lj).
           string
                    "("                delimited by size
                    0031telfl(3:2)     delimited by size
                    ")"                delimited by size
                    0031telfl(5:4)     delimited by size        
                    "."                delimited by size
                    0031telfl(9:4)     delimited by size        
                                       into app-lojas-telefone-resp(lj).

           string
                    "("                delimited by size
                    0031whats(3:2)     delimited by size
                    ")"                delimited by size
                    0031whats(5:4)     delimited by size        
                    "."                delimited by size
                    0031whats(9:4)     delimited by size        
                                       into app-lojas-whats-resp(lj).

                                       
           move     function trim(0031email)
                                       to app-lojas-email-resp(lj).                                                     

           move     function trim(0031nomger)
                                       to app-lojas-gerente-resp(lj).
           
           
           move     function trim(0031latitude)
                                       to app-lojas-longitude-resp(lj).
           move     function trim(0031longitude)
                                      to app-lojas-latitude-resp(lj).
                                       
                                       
                                       
           move     spaces             to app-lojas-distancia-resp(lj).
                                                                                                                 
           if       aux-latitude       equal        zeros
                    go                 carrega-lojas-10.
           perform  calcula-distancia
           string
                    function trim(aux-km)       delimited by size
                    "Km"              delimited by size
                                      into app-lojas-distancia-resp(lj). 
           go       carrega-lojas-10.                                                   
       carrega-lojas-20.
           move     "true"             to      app-lojas-success-resp.
           move     "OK"               to      app-lojas-message-resp.
       
       carrega-lojas-ex.
           exit.  
      *-----------------------------------------------------------------
       calcula-distancia.             
           initialize                  aux-reslat
                                       aux-reslon.
           move     aux-latitude       to           aux-lat1
           move     aux-longitude      to           aux-lon1.
           move     function numval(0031latitude)
                                       to           aux-lat2.
           move     function numval(0031longitude)
                                       to           aux-lon2.                                  
                                       
           compute  aux-reslat         =            aux-lat1  
                                       -            aux-lat2.
           compute  aux-reslat         =            aux-reslat
                                       *            60.
           compute  aux-metlat         =            aux-reslat
                                       *            1852.
                                       
           compute  aux-reslon         =            aux-lon1
                                       -            aux-lon2.
           compute  aux-reslon         =            aux-reslon
                                       *            60.
           compute  aux-metlon         =            aux-reslon
                                       *            1852.
                                       
           compute  aux-metlat         =            aux-metlat
                                       *            aux-metlat.
           compute  aux-metlon         =            aux-metlon
                                       *            aux-metlon. 
           compute  aux-raiz           =            aux-metlat
                                       +            aux-metlon.
           move     function sqrt(aux-raiz)
                                       to           aux-raiz. 
           compute  aux-distancia      =            aux-raiz
                                       /            1000.  
                                       
           move     aux-distancia      to           wk-distancia.
           if       wk-resto           less         500
                    move wk-km         to           aux-km
           else
                    add  1             to           wk-km
                    move wk-km         to           aux-km.         
      *-----------------------------------------------------------------
       lojas-proxima.
           initialize                  ws-lojas-proxima-resp.
           copy     "cdatahj".
           string   
                    "t-loj666"         delimited by size
                    hoje-data          delimited by size
                    aux-time1          delimited by size
                                       into         ne-s888.                    
           close    s888.
           open     output             s888.
           if       sta888             equal        "93"
                    go                 lojas-proxima.                
           if       not valid-s888
                    perform            erro-estendido
                    move "false"       to      app-proxima-success-resp
                    string
                    "Serviço Indisponível(ab-s888-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-proxima-message-resp
                    go                 lojas-proxima-ex.
           close    s003.
           open     input              s003.
           if       not valid-s003
                    perform            erro-estendido
                    move "false"       to      app-proxima-success-resp
                    string
                    "Serviço Indisponível(ab-s003-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-proxima-message-resp
                    go                 lojas-proxima-ex.

           close    s003a.
           open     input              s003a.
           if       not valid-s003a
                    perform            erro-estendido
                    move "false"       to      app-proxima-success-resp
                    string
                    "Serviço Indisponível(ab-s003a-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-proxima-message-resp
                    go                 lojas-proxima-ex.
                    
           move     app-proxima-latitude-in           to  aux-latitude
           move     app-proxima-longitude-in          to  aux-longitude
           
           if       aux-latitude       equal        zeros
           and      app-proxima-ibge-in equal       zeros
                    move "false"       to      app-proxima-success-resp
                    string
                "Desculpe, não foi possível determinar sua Localização."
                                       delimited by size
                                       into    app-proxima-message-resp
                    go                 lojas-proxima-ex.

           move     low-values         to          dci-where-constraint.
           string
                    '"0031ident"= 7'      delimited by size
                                       into         dci-where-constraint       
           inspect  dci-where-constraint replacing trailing 
                    spaces             by           low-values.
           call     "dci_set_where_constraint" 
                                       using dci-where-constraint.
           move     spaces             to           0032descr
           start    s003  key is       not less     0032chave
           if       not valid-s003
                    perform            erro-estendido
                    move "false"       to      app-proxima-success-resp
                    string
                    "Serviço Indisponível(st-s003-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-proxima-message-resp
                    move low-values    to          dci-where-constraint
                    call "dci_set_where_constraint" 
                                       using dci-where-constraint
                    go                 lojas-proxima-ex.
           move     low-values         to          dci-where-constraint.
           call     "dci_set_where_constraint" 
                                       using dci-where-constraint.

           move     zeros              to           lp. 
       lojas-proxima-10.
           read     s003  next  with   no lock      at end
                    go                 lojas-proxima-20.
           if       not valid-s003
                    perform            erro-estendido
                    move "false"       to      app-proxima-success-resp
                    string
                    "Serviço Indisponível(ac-s003-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-proxima-message-resp
                    go                 lojas-proxima-ex.
           if       0031ident          not equal    7
                    go                 lojas-proxima-20.
           if       0031depto          not equal    1
                    go                 lojas-proxima-10.
           if       0031tpesp          equal        "1"
                    go                 lojas-proxima-10.
           move     0031chave          to           003achave.
           read     s003a  with        no lock.
           if       not valid-s003a
                    go                 lojas-proxima-10.
           if       0031nomger         equal        spaces
                    go                 lojas-proxima-10.
           move     0031assoc          to           aux-codmun(1:2)
           move     0031ibgefl         to           aux-codmun(3:5).                    
           if       app-proxima-ibge-in not equal   zeros
           and      app-proxima-ibge-in not equal   aux-codmun
                    go                 lojas-proxima-10.                                        
           perform  calcula-distancia.
           move     wk-km              to           8881dista.
           move     0031codig          to           8881filia.
           write    8881cadas.
           go       lojas-proxima-10.                          

       lojas-proxima-20.
           close    s888.
           open     input              s888.
           move     zeros              to           lp.
       lojas-proxima-30.
           read     s888  next  with   no lock      at end
                    go                 lojas-proxima-40.
           move     7                  to           0031ident.
           move     8881filia          to           0031codig.
           read     s003  with         no lock.
           if       not valid-s003
                    go                 lojas-proxima-30.

           move     0031chave          to           003achave.
           read     s003a  with        no lock.
           if       not valid-s003a
                    go                 lojas-proxima-30.

           add      1                  to           lp.
           if       lp                 equal        5
                    go                 lojas-proxima-40.  


           string   
                    0031cidfl          delimited by "   "
                    " - "              delimited by size
                    0031estfl          delimited by size
                                  into      app-proxima-cidade-resp(lp).
           move     0031natop          to           aux-numer.                                  
           string
                    0031endfl          delimited by "   "
                    ", "               delimited by size
                    aux-numer          delimited by "  "
                                   into   app-proxima-endereco-resp(lp).
           string
                    "("                delimited by size
                    0031telfl(3:2)     delimited by size
                    ")"                delimited by size
                    0031telfl(5:4)     delimited by size        
                    "."                delimited by size
                    0031telfl(9:4)     delimited by size        
                                     into app-proxima-telefone-resp(lp).
           string
                    "("                delimited by size
                    0031whats(3:2)     delimited by size
                    ")"                delimited by size
                    0031whats(5:4)     delimited by size        
                    "."                delimited by size
                    0031whats(9:4)     delimited by size        
                                       into app-proxima-whats-resp(lp).

                                       
           move     function trim(0031email)
                                       to app-proxima-email-resp(lp).                                                     

           move     function trim(0031nomger)
                                       to app-proxima-gerente-resp(lp).
           move     function trim(0031latitude)
                                       to app-proxima-latitude-resp(lp).
           move     function trim(0031longitude)
                                      to app-proxima-longitude-resp(lp).
           MOVE     8881dista          to           wk-km.                                       
           move     wk-km              to           aux-km.
           if       wk-km              equal        0
                    string
                    "Menos de 1Km"     delimited by size
                                    into app-proxima-distancia-resp(lp)
           else           
                    string
                    function trim(aux-km)       delimited by size
                    "Km"              delimited by size
                                    into app-proxima-distancia-resp(lp).
           go       lojas-proxima-30.                                                              
                    
                    
                                       
       lojas-proxima-40.
           move     spaces             to           aux-caminho.
           string
                    "/usr/share/tomcat9/webapps/servicecomercial/"
                                       delimited by size
                    ne-s888            delimited by "    "
                    ".dat"             delimited by size
                                       into         aux-caminho.                                       
           call     "c$delete"         using        aux-caminho.

           string
                    "/usr/share/tomcat9/webapps/servicecomercial/"
                                       delimited by size
                    ne-s888            delimited by "    "
                    ".idx"             delimited by size
                                       into         aux-caminho.                                       
           call     "c$delete"         using        aux-caminho.
           move     "true"             to      app-proxima-success-resp.
           move     "OK"               to      app-proxima-message-resp.
       lojas-proxima-ex.
           exit.  
      *-----------------------------------------------------------------
       grava-device.
           close    sce002.
           open     i-o                sce002.
           copy     "cdatahj".                    
           initialize                  sce002-reg.         
           move     app-device-deviceId-in
                                       to           sce002-device.
           read     sce002  with       no lock.
           if       not valid-sce002
                    move 1             to           sce002-resp1
                                                    sce002-resp2
                                                    sce002-resp3
                                                    sce002-resp4
                                                    sce002-resp5
                    write              sce002-reg.
           move     app-device-pushToken-in
                                       to           sce002-token.         
           move     app-device-deviceOs-in
                                       to           sce002-sisop.
           move     hoje-data          to           aux-data.
           move     aux-dia            to           inv-dia.           
           move     aux-mes            to           inv-mes.           
           move     aux-ano            to           inv-ano.           
           move     inv-data           to           sce002-datcad.
           
           
           move     "false"            to        app-device-versao-resp.
           
           move     app-device-versaoApp-in
                                       to           aux-versao.
           
           if       sce002-sisop       equal        "iOS"
              if    aux-versao         less         aux-ver-ios
                    move "true"        to        app-device-versao-resp
              else
                    next               sentence      
           else
           if      aux-versao          less      aux-ver-android
                    move "true"        to        app-device-versao-resp.
                                                           
           move     aux-versao         to           sce002-versao.   
           
           if       app-device-codcli-in >          zeros
                    move app-device-codcli-in to    aux-codcl
                    move aux-numcl     to           sce002-codcl
           end-if.
           rewrite  sce002-reg.
           if       stat-sce002        equal        "23"
                    write              sce002-reg.
           
           move     "true"             to       app-device-success-resp
           move     "OK"               to      app-device-message-resp.
           
           if       aux-versao         not equal    zeros
           and      aux-versao         <            154    
                    string 
                    "CRIAMOS UMA NOVA VERSÃO DO APP LOJA SOLAR."
                                       delimited by size
                   "DESINSTALE a versão que você possui em seu Celular."
                                       delimited by size
               "Acesse a sua Loja de Aplicativos e baixe a Nova Versão."
                                       DELIMITED BY SIZE
               "versão do seu aplicati - " aux-versao
                                       DELIMITED BY SIZE
                                       into app-device-message-resp
                     move "false"      to   app-device-success-resp
                    exit               paragraph.
       
           
           
       grava-device-ex.
           exit.  
      *-----------------------------------------------------------------
       FILTRA-FILIAIS.
           close    s003.
           open     input              s003.
           if       not valid-s003
                    go                 FFILIAIS-EX.

           close    s003a.
           open     input              s003a.
           if       not valid-s003a
                    go                 FFILIAIS-EX.
       
           move     low-values         to          dci-where-constraint.
           string
                    '"0031ident"= 7'      delimited by size
                                       into         dci-where-constraint       
           inspect  dci-where-constraint replacing trailing 
                    spaces             by           low-values.
           call     "dci_set_where_constraint" 
                                       using dci-where-constraint.
           move     spaces             to           0032descr
           start    s003  key is       not less     0032chave
           if       not valid-s003
                    move low-values    to          dci-where-constraint
                    call "dci_set_where_constraint" 
                                       using dci-where-constraint
                    go                 FFILIAIS-EX.
           move     low-values         to          dci-where-constraint.
           call     "dci_set_where_constraint" 
                                       using dci-where-constraint.
                               
       FFILIAIS-10.
           read     s003  next  with   no lock      at end
                    go                 FFILIAIS-EX.
           if       not valid-s003
                    go                 FFILIAIS-EX.
           if       0031ident          not equal    7
                    go                 FFILIAIS-EX.
           if       0031depto          not equal    1
                    go                 FFILIAIS-10.
           if       0031tpesp          equal        "1"
                    go                 FFILIAIS-10.
           move     0031chave          to           003achave.
           read     s003a  with        no lock.
           if       not valid-s003a
                    go                 FFILIAIS-10.
           if       0031nomger         equal        spaces
                    go                 FFILIAIS-10.
           move     0031assoc          to           aux-codmun(1:2)
           move     0031ibgefl         to           aux-codmun(3:5).                    
                    
                    
           move     zeros              to           i.
       FFILIAIS-20.
           add      1                  to           i.
           if       i                  greater      999
                    go                 FFILIAIS-10.
           if       TB-FIL (i)         equal        aux-codmun
                    go                 FFILIAIS-10.
           if       tb-fil (i)         not equal    aux-codmun
           and      tb-fil (i)         not equal    zeros
                    go                 FFILIAIS-20.
           move     aux-codmun         to           tb-fil (i).                    
           GO       FFILIAIS-10.      

       FFILIAIS-EX.
           EXIT.
      *-----------------------------------------------------------------
       verifica-filial.
           move     zeros              to           i i-fil.
       vfilial-10.
           add      1                  to           i
           if       i                  greater      999
                    go                 vfilial-ex.
           if       tb-fil (i)         equal        zeros
                    go                 vfilial-ex.
           if       tb-fil (i)         not equal    0841codigo
                    go                 vfilial-10.
           move     1                  to           i-fil.                                                                                                      
       vfilial-ex.
           exit.
      *-----------------------------------------------------------------
       pesquisa-satisfacao.
           initialize                  ws-pesquisa-satisfacao-resp.
           close    loj001
           open     input              loj001.
           if       not valid-loj001
                    perform            erro-estendido
                    move "false"       to      app-pesquisa-success-resp
                    string
                    "Serviço Indisponível(ab-loj001-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-pesquisa-message-resp
                    go                 pesquisa-satisfacao-ex.
           close    s017
           open     input              s017.
           if       not valid-s017
                    perform            erro-estendido
                    move "false"       to      app-pesquisa-success-resp
                    string
                    "Serviço Indisponível(ab-s017-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-pesquisa-message-resp
                    go                 pesquisa-satisfacao-ex.
           close    s003
           open     input              s003.
           if       not valid-s003
                    perform            erro-estendido
                    move "false"       to      app-pesquisa-success-resp
                    string
                    "Serviço Indisponível(ab-s003-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-pesquisa-message-resp
                    go                 pesquisa-satisfacao-ex.
           close    sce003.
           open     i-o                sce003.
           if       not valid-sce003
                    perform            erro-estendido
                    move "false"       to      app-pesquisa-success-resp
                    string
                    "Serviço Indisponível(ab-sce003-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-pesquisa-message-resp
                    go                 pesquisa-satisfacao-ex.
           move     app-pesquisa-pesquisaId-in
                                       to           sce003-codigo.
           read     sce003  with       no lock.
           if       not valid-sce003
                    perform            erro-estendido
                    move "false"       to      app-pesquisa-success-resp
                    string
                    "Serviço Indisponível(ac-sce003-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-pesquisa-message-resp
                    go                 pesquisa-satisfacao-ex.
           move     sce003-codcl       to           aux-codcl.                    
           move     aux-numcl          to           0171codcl.
           read     s017   with        no lock.
           if       not valid-s017                                                                                                    
                    perform            erro-estendido
                    move "false"       to      app-pesquisa-success-resp
                    string
                    "Serviço Indisponível(ac-s017-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-pesquisa-message-resp
                    go                 pesquisa-satisfacao-ex.
           move     sce003-filial      to           LOJ001-filial.
           move     sce003-numate      to           LOJ001-numate.
           read     loj001  with       no lock.   
           if       not valid-loj001                 
                    perform            erro-estendido
                    move "false"       to      app-pesquisa-success-resp
                    string
                    "Serviço Indisponível(ac-loja001-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-pesquisa-message-resp
                    go                 pesquisa-satisfacao-ex.
                    
           move     LOJ001-codven      to           0031codig.
           move     8                  to           0031ident.
           read     s003  with         no lock.
           if       not valid-s003                    
                    perform            erro-estendido
                    move "false"       to      app-pesquisa-success-resp
                    string
                    "Serviço Indisponível(ac-s003-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-pesquisa-message-resp
                    go                 pesquisa-satisfacao-ex.
           move     0032descr          to           aux-nome-ven.                    

           move     LOJ001-filial      to           0031codig.
           move     7                  to           0031ident.
           read     s003  with         no lock.
           if       not valid-s003                    
                    perform            erro-estendido
                    move "false"       to      app-pesquisa-success-resp
                    string
                    "Serviço Indisponível(ac-s003-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-pesquisa-message-resp
                    go                 pesquisa-satisfacao-ex.
           move     0032descr          to           aux-nome-fil.
                               
           string
                    "Olá, "            delimited by size
                    0172nomcl          delimited by spaces
                    ", tudo bem com você? "
                                       delimited by size
                                       into app-pesquisa-texto-resp.
           string
                    app-pesquisa-texto-resp delimited by "    "
                    "Sua opinião é muito importante para nós. "
                                       delimited by size
                                       into app-pesquisa-texto-resp.
           string
                    app-pesquisa-texto-resp delimited by "    "
                    "Notamos que você esteve em nossa Loja de "
                                       delimited by size
                                       into app-pesquisa-texto-resp.
                                       
           move     LOJ001-datfim      to           inv-data.
           move     inv-dia            to           aux-dia.                                       
           move     inv-mes            to           aux-mes.                                       
           move     inv-ano            to           aux-ano.
           move     aux-data           to           ed-data.                                       
                                       
                                       
           string
                    app-pesquisa-texto-resp delimited by "   "    
                    aux-nome-fil       delimited by "   "
                    " no dia "          delimited by size
                    ed-data            delimited by size
                    ","                delimited by size
                                       into app-pesquisa-texto-resp.
                               
           if       0171sexcl          equal        "F"
                    string
                    app-pesquisa-texto-resp delimited by "   "
                    " e que você foi atendida pelo nosso colega "  
                                       delimited by size
                                       into app-pesquisa-texto-resp
           else
           if       0171sexcl          equal        "M"
                    string
                    app-pesquisa-texto-resp delimited by "   "
                    "e que você foi atendido pelo nosso colega "  
                                       delimited by size
                                       into app-pesquisa-texto-resp
           else                            
                    string
                    app-pesquisa-texto-resp delimited by "   "
                    "e que foi atendido(a) pelo nosso colega "  
                                       delimited by size
                                       into app-pesquisa-texto-resp.
           string                            
                    app-pesquisa-texto-resp delimited by "   "
                    aux-nome-ven       delimited by "   "                                       
                    "."                delimited by size
                                       into app-pesquisa-texto-resp.
                                       
           string
                    app-pesquisa-texto-resp delimited by "   "
                    " Gostariamos de ouvir você!  Deixe seu co"  
                                       delimited by size
                                       into app-pesquisa-texto-resp.
           string
                    app-pesquisa-texto-resp delimited by "   "
                    "mentário e clique em um Solzinho para clas"  
                                       delimited by size
                                       into app-pesquisa-texto-resp.
           string
                    app-pesquisa-texto-resp delimited by "   "
                    "sificar seu Atendimento. Muito Obrigado!"  
                                       delimited by size
                                       into app-pesquisa-texto-resp.
           move     "true"             to     app-pesquisa-success-resp.
           move     "OK"               to     app-pesquisa-message-resp.
       pesquisa-satisfacao-ex.
           EXIT.  
      *-----------------------------------------------------------------
       resposta-pesquisa.
           initialize                  ws-resposta-pesquisa-resp.
           close    sce003.
           open     i-o                sce003.
           if       not valid-sce003
                    perform            erro-estendido
                    move "false"       to      app-resposta-success-resp
                    string
                    "Serviço Indisponível(ab-sce003-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-resposta-message-resp
                    go                 resposta-pesquisa-ex.
           move     app-resposta-pesquisaId-in
                                       to           sce003-codigo.
           read     sce003  with       no lock.
           if       not valid-sce003
                    perform            erro-estendido
                    move "false"       to      app-resposta-success-resp
                    string
                    "Serviço Indisponível(ac-sce003-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-resposta-message-resp
                    go                 resposta-pesquisa-ex.
           move     app-resposta-resposta-in    
                                       to           sce003-resposta.
           move     function trim(app-resposta-comentario-in)  
                                       to           sce003-comentario.
           rewrite  sce003-reg.                                                    
           if       not valid-sce003
                    perform            erro-estendido
                    move "false"       to      app-resposta-success-resp
                    string
                    "Serviço Indisponível(at-sce003-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-resposta-message-resp
                    go                 resposta-pesquisa-ex.
           move     "true"             to     app-resposta-success-resp.
           move     "OK"               to     app-resposta-message-resp.
       resposta-pesquisa-ex.
           exit.  
      *-----------------------------------------------------------------
       carrega-cliente.
           initialize                  ws-carrega-cliente-resp.
           close    s017.
           open     input              s017.
           if       not valid-s017
                    perform            erro-estendido
                    move "false"       to      app-cliente-success-resp
                    string
                    "Serviço Indisponível(ab-s017-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-cliente-message-resp
                    go                 carrega-cliente-ex.
           close    s717.
           open     input              s717.
           if       not valid-s717
                    perform            erro-estendido
                    move "false"       to      app-cliente-success-resp
                    string
                    "Serviço Indisponível(ab-s717-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-cliente-message-resp
                    go                 carrega-cliente-ex.
                    
           move     app-cliente-token-in  
                                       to           aux-token.
           move     aux-t3             to           7171codcl.
           read     s717  with         no lock.
           if       not valid-s717
                    perform            erro-estendido
                    move "false"       to      app-cliente-success-resp
                    string
                    "Serviço Indisponível(ac-s717-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-cliente-message-resp
                    go                 carrega-cliente-ex.
                    
           if       app-cliente-token-in  not equal    7171token
                    perform            erro-estendido
                    move "false"        to      app-cliente-success-resp
                    string
                    "Token Inválido, Você será Desconectado."
                                       delimited by size
                                       into    app-cliente-message-resp
                    move "false"       to      app-cliente-token-resp                                       
                    go                 carrega-cliente-ex.

           move     7171codcl          to           0171codcl.
           read     s017   with        no lock.
           if       not valid-s017
                    perform            erro-estendido
                    move "false"       to      app-cliente-message-resp
                    string
                    "Serviço Indisponível(ac-s017-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-cliente-message-resp
                    go                 carrega-cliente-ex.
           move     spaces             to           ws-dados
                                                    wk-dados
           move     zeros              to           i j.                                                    
           move     0175cgcpf          to           ws-dados
           perform  limpa-numeros      thru         lnumeros-ex.
           move     spaces             to      app-cliente-cpfcnpj-resp.        
           move     FUNCTION TRIM(wk-dados)
                                       to      app-cliente-cpfcnpj-resp.     
           move     FUNCTION TRIM(0172nomcl)
                                       to      app-cliente-nome-resp.     
           move     FUNCTION TRIM(0171endcl)          
                                       to      app-cliente-endereco-resp       
           move     0171cepcl          to      app-cliente-cep-resp.             
           move     FUNCTION TRIM(0171cidcl)          
                                       to      app-cliente-cidade-resp.     
           move     0171estcl          to      app-cliente-uf-resp.
          
           move     spaces             to           ws-dados
                                                    wk-dados
           move     zeros              to           i j.                                                    
           move     FUNCTION TRIM(0171celul)
                                       to           ws-dados
           perform  limpa-numeros      thru         lnumeros-ex.
           move     spaces             to      app-cliente-celular-resp.        
           move     FUNCTION TRIM(wk-dados)
                                       to      app-cliente-celular-resp.             
           move     FUNCTION TRIM(7171email)
                                       to      app-cliente-email-resp.              
           move     0171nascl          to      ed-data
           move     function trim(ed-data)
                                       to     app-cliente-dtnasc-resp.     
           move     "true"             to     app-cliente-success-resp
                                              app-cliente-token-resp.      
           move     "OK"               to     app-cliente-message-resp.
           move     "false"            to     app-cliente-crediario-resp
           if       0171limit          greater      zeros
                    move "true"        to    app-cliente-crediario-resp. 
                    
           move     function trim(0171maecl)
                                       to    app-cliente-nomeMae-in.   
           if       0171sexcl          equal        "F"
                    move "Feminino"    to            app-cliente-sexo-in
           else     
                    move "Masculino"   to           app-cliente-sexo-in.                    
           move     function trim(7171escolaridade)
                                       to         app-cliente-escola-in.    
           move     function trim(0171local)
                                       to        app-cliente-locTrab-in.   
           move     function trim(0171cargo)
                                       to      app-cliente-profissao-in. 
           move     0171salar          to           ed-valor.           
           move     function trim(ed-valor)
                                       to          app-cliente-renda-in.
           if       0171estcv          equal        "S"
                    move "Solteiro"    TO         app-cliente-estCiv-in.
           if       0171estcv          equal        "C"
                    move "Casado"      TO         app-cliente-estCiv-in.
           if       0171estcv          equal        "V"
                    move "Viúvo"       TO         app-cliente-estCiv-in.
           if       0171estcv          equal        "E"
                    move "Separado"    TO         app-cliente-estCiv-in.
           if       0171estcv          equal        "D"
                    move "Divorciado"  TO         app-cliente-estCiv-in.
                                                                
           move     function trim(0171nomcj)
                                       to        app-cliente-nomConj-in.   
           move     function numval(0171cpfcj)
                                       to        app-cliente-cpfConj-in.
       carrega-cliente-ex.
           exit.  
      *-----------------------------------------------------------------
       cadastro-cliente.
           copy     "cdatahj".
           initialize                  ws-cadastro-cliente-resp.
           close    s017.
           open     i-o                s017.
           if       not valid-s017
                    perform            erro-estendido
                    move "false"       to      app-cad-success-resp
                    string
                    "Serviço Indisponível(ab-s017-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-cad-message-resp
                    go                 cadastro-cliente-ex.
           close    s717.
           open     i-o                s717.
           if       not valid-s717
                    perform            erro-estendido
                    move "false"       to      app-cad-success-resp
                    string
                    "Serviço Indisponível(ab-s717-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-cad-message-resp
                    go                 cadastro-cliente-ex.
           move     app-cad-token-in   to          aux-token.
           move     aux-t3             to           7171codcl.
           read     s717  with         no lock.
           if       not valid-s717
                    initialize         7171cadas.
           if       app-cad-token-in   not equal    7171token
                    perform            erro-estendido
                    move "false"        to      app-cad-success-resp
                    string
                    "Token Inválido, Você será Desconectado."
                                       delimited by size
                                       into    app-cad-message-resp
                    move "false"       to      app-cad-token-resp                                       
                    go                 cadastro-cliente-ex.
           move     "true"             to      app-cad-token-resp.                              

           move     7171codcl          to           0171codcl.
           read     s017   with        no lock.
           if       not valid-s017
                    perform            erro-estendido
                    move "false"       to      app-cad-success-resp
                    string
                    "Serviço Indisponível(ac-s017-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-cad-message-resp
                    move "true"        to      app-cad-token-resp                                       
                    go                 cadastro-cliente-ex.
                    
           move     app-cad-nome-in    to           0172nomcl
                                                    0173nomcl      
                                                    0174nomcl
                                                    0176nomcl.
           if       0172nomcl          equal        spaces
                    move "false"       to      app-cad-success-resp
                    string
                    "Nome não pode ser em branco, verifique."
                                       delimited by size
                                       into    app-cad-message-resp
                    move "true"        to      app-cad-token-resp                                       
                    go                 cadastro-cliente-ex.
                                                               
              
           move     app-cad-endereco-in
                                       to           0171endcl.
           if       0171endcl          equal        spaces
                    move "false"       to      app-cad-success-resp
                    string
                    "Endereço não é válido, verifique."
                                       delimited by size
                                       into    app-cad-message-resp
                    move "true"        to      app-cad-token-resp                                       
                    go                 cadastro-cliente-ex.
                                                            
           move     app-cad-cep-in
                                       to           0171cepcl.
           if       0171cepcl          equal        zeros
                    move "false"       to      app-cad-success-resp
                    string
                    "C.E.P não é válido, verifique."
                                       delimited by size
                                       into    app-cad-message-resp
                    move "true"        to      app-cad-token-resp                                       
                    go                 cadastro-cliente-ex.
           move     app-cad-cidade-in
                                       to           0171cidcl.
           move     function trim(app-cad-uf-in)
                                       to           0171estcl.
           if       0171estcl          equal        "43"
                    move "RS"          to           0171estcl.                                                 
           move     spaces             to           ws-dados
                                                    wk-dados
           move     zeros              to           i j.                                                    
           move     app-cad-celular-in 
                                       to           ws-dados
           perform  limpa-numeros      thru         lnumeros-ex.
           move     spaces             to       app-cad-celular-in.        
           move     wk-dados           to       app-cad-celular-in.             
           
           move     app-cad-celular-in
                                       to           0171celul
                                                    7171celul.           
           move     app-cad-email-in
                                       to           0171obse2
                                                    7171email.         
           move     app-cad-dtnasc-in          
                                       to           0171nascl
                                                    aux-data.
           if       0171nascl          equal        zeros                                           
                    move "false"       to      app-cad-success-resp
                    string
                    "Data de Nascimento válida, verifique."
                                       delimited by size
                                       into    app-cad-message-resp
                    move "true"        to      app-cad-token-resp                                       
                    go                 cadastro-cliente-ex.
           if       aux-dia            less         1
           or       aux-dia            greater      31
                    move "false"       to      app-cad-success-resp
                    string
                    "Data de Nascimento válida, verifique."
                                       delimited by size
                                       into    app-cad-message-resp
                    move "true"        to      app-cad-token-resp                                       
                    go                 cadastro-cliente-ex.
           if       aux-mes            less         1
           or       aux-mes            greater      12
                    move "false"       to      app-cad-success-resp
                    string
                    "Data de Nascimento válida, verifique."
                                       delimited by size
                                       into    app-cad-message-resp
                    move "true"        to      app-cad-token-resp                                       
                    go                 cadastro-cliente-ex.
           if       aux-mes            equal        2
           and      aux-dia            greater      29                         
                    move "false"       to      app-cad-success-resp
                    string
                    "Data de Nascimento válida, verifique."
                                       delimited by size
                                       into    app-cad-message-resp
                    move "true"        to      app-cad-token-resp                                       
                    go                 cadastro-cliente-ex.
           if       (aux-mes = 4 or 06 or 09 or 11)
           and      aux-dia            greater      30
                    move "false"       to      app-cad-success-resp
                    string
                    "Data de Nascimento válida, verifique."
                                       delimited by size
                                       into    app-cad-message-resp
                    move "true"        to      app-cad-token-resp                                       
                    go                 cadastro-cliente-ex.
                               
                                       
                                       
                                       
           move     hoje-data          to           aux-data
           move     aux-dia            to           inv-dia.
           move     aux-mes            to           inv-mes.
           move     aux-ano            to           inv-ano.
           move     inv-data           to           0177datal.
           perform  s017-rewrite.
           if       acesso-erro
                    move "false"       to           app-cad-success-resp
                    string "Serviço indisponível - "
                    gnr-dtMessage      into        app-cad-message-resp
                    end-string                                          
                    go                 cadastro-cliente-ex
           end-if.
           rewrite  7171cadas.         
           if       not valid-s717
                    perform            erro-estendido
                    move "false"       to      app-cad-success-resp
                    string
                    "Serviço Indisponível(ac-s717-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-cad-message-resp
                    go                 cadastro-cliente-ex.
           move     "true"             to     app-cad-success-resp.
           move     "Atualização concluída com Sucesso."
                                       to     app-cad-message-resp.
           move     "true"             to     app-cad-token-resp.                                                                     
       cadastro-cliente-ex.
           exit.  
      *-----------------------------------------------------------------
       replica-cliente.
           copy     "cdatahj".
           initialize                  ws-replica-cliente-resp.
           close    s017.
           open     i-o                s017.
           if       not valid-s017
                    perform            erro-estendido
                    move "false"       to      app-replica-success-resp
                    string
                    "Serviço Indisponível(ab-s017-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-replica-message-resp
                    go                 replica-cliente-ex.
           move     app-replica-codcl-in to         0171codcl.
           read     s017  with         no lock.
           if       not valid-s017
                    perform            erro-estendido
                    move "false"       to      app-replica-success-resp
                    string
                    "Serviço Indisponível(ac-s017-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-replica-message-resp
                    go                 replica-cliente-ex.
           perform  s017-rewrite.
           if       acesso-erro
                    move "false"       to      app-replica-success-resp
                    string
                    "Serviço Indisponível (wr-s017) - "
                    gnr-dtMessage      into    app-replica-message-resp
                    go                 replica-cliente-ex
           end-if.
           move     "true"             to      app-replica-success-resp.
           move     "OK"               to      app-replica-message-resp.
       replica-cliente-ex.
           exit.  
      *-----------------------------------------------------------------
       altera-cliente.
           copy     "cdatahj".
           initialize                  ws-altera-cliente-resp.
           close    s017.
           open     i-o                s017.
           if       not valid-s017
                    perform            erro-estendido
                    move "false"       to      app-altera-success-resp
                    string
                    "Serviço Indisponível(ab-s017-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-altera-message-resp
                    go                 altera-cliente-ex.
           close    s717.
           open     i-o                s717.
           if       not valid-s717
                    perform            erro-estendido
                    move "false"       to      app-altera-success-resp
                    string
                    "Serviço Indisponível(ab-s717-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-altera-message-resp
                    go                 altera-cliente-ex.
           move     app-altera-token-in to          aux-token.
           move     aux-t3             to           7171codcl.
           read     s717  with         no lock.
           if       not valid-s717
                    initialize         7171cadas.
           if       app-altera-token-in  not equal  7171token
                    perform            erro-estendido
                    move "false"        to      app-altera-success-resp
                    string
                    "Token Inválido, Você será Desconectado."
                                       delimited by size
                                       into    app-altera-message-resp
                    move "false"       to      app-altera-token-resp                                       
                    go                 altera-cliente-ex.
           move     "true"             to      app-altera-token-resp.                              

           move     7171codcl          to           0171codcl.
           read     s017   with        no lock.
           if       not valid-s017
                    perform            erro-estendido
                    move "false"       to      app-altera-success-resp
                    string
                    "Serviço Indisponível(ac-s017-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-altera-message-resp
                    move "true"        to      app-altera-token-resp                                       
                    go                 altera-cliente-ex.
                    
           move     app-altera-nome-in to           0172nomcl
                                                    0173nomcl      
                                                    0174nomcl
                                                    0176nomcl.
           if       0172nomcl          equal        spaces
                    move "false"       to      app-altera-success-resp
                    string
                    "Nome não pode ser em branco, verifique."
                                       delimited by size
                                       into    app-altera-message-resp
                    move "true"        to      app-altera-token-resp                                       
                    go                 altera-cliente-ex.
                                                               
              
           move     app-altera-endereco-in
                                       to           0171endcl.
           if       0171endcl          equal        spaces
                    move "false"       to      app-altera-success-resp
                    string
                    "Endereço não é válido, verifique."
                                       delimited by size
                                       into    app-altera-message-resp
                    move "true"        to      app-altera-token-resp                                       
                    go                 altera-cliente-ex.
                                                            
           move     app-altera-cep-in
                                       to           0171cepcl.
           if       0171cepcl          equal        zeros
                    move "false"       to      app-altera-success-resp
                    string
                    "C.E.P não é válido, verifique."
                                       delimited by size
                                       into    app-altera-message-resp
                    move "true"        to      app-altera-token-resp                                       
                    go                 altera-cliente-ex.
           move     app-altera-cidade-in
                                       to           0171cidcl.
           move     function trim(app-altera-uf-in)
                                       to           0171estcl.
           if       0171estcl          equal        "43"
                    move "RS"          to           0171estcl.                                                 
           move     spaces             to           ws-dados
                                                    wk-dados
           move     zeros              to           i j.                                                    
           move     app-altera-celular-in 
                                       to           ws-dados
           perform  limpa-numeros      thru         lnumeros-ex.
           move     spaces             to       app-altera-celular-in.        
           move     wk-dados           to       app-altera-celular-in.             
           
           move     app-altera-celular-in
                                       to           0171celul
                                                    7171celul.           
           move     app-altera-email-in
                                       to           0171obse2
                                                    7171email.         
           move     app-altera-dtnasc-in          
                                       to           0171nascl
                                                    aux-data.
      *     if       0171nascl          equal        zeros                                           
      *              move "false"       to      app-altera-success-resp
      *              string
      *              "Data de Nascimento válida, verifique."
      *                                 delimited by size
      *                                 into    app-altera-message-resp
      *              move "true"        to      app-altera-token-resp                                       
      *              go                 altera-cliente-ex.
           if       0171nascl          <>           zeros         
                    if aux-dia         less         1
                    or aux-dia         greater      31
                       move "false"    to        app-altera-success-resp
                       string
                       "Data de Nascimento inválida, verifique."
                                       delimited by size
                                       into      app-altera-message-resp
                       move "true"     to        app-altera-token-resp                                       
                       go              altera-cliente-ex
                    end-if   
                    if aux-mes         less         1
                    or aux-mes         greater      12
                       move "false"    to        app-altera-success-resp
                       string
                       "Data de Nascimento inválida, verifique."
                                       delimited by size
                                       into      app-altera-message-resp
                       move "true"     to          app-altera-token-resp                                       
                       go              altera-cliente-ex
                    end-if   
                    if aux-mes         equal        2
                    and aux-dia        greater      29                         
                        move "false"   to        app-altera-success-resp
                        string
                        "Data de Nascimento inválida, verifique."
                                       delimited by size
                                       into      app-altera-message-resp
                        move "true"    to          app-altera-token-resp                                       
                        go             altera-cliente-ex
                    end-if    
                    if (aux-mes = 4 or 06 or 09 or 11)
                    and aux-dia        greater      30
                        move "false"   to        app-altera-success-resp
                        string
                        "Data de Nascimento inválida, verifique."
                                       delimited by size
                                       into    app-altera-message-resp
                        move "true"    to      app-altera-token-resp                                       
                        go             altera-cliente-ex
                    end-if
           end-if.         
                                      
           move     hoje-data          to           aux-data
           move     aux-dia            to           inv-dia.
           move     aux-mes            to           inv-mes.
           move     aux-ano            to           inv-ano.
           move     inv-data           to           0177datal.
           perform  s017-rewrite.
           if       acesso-erro                    
                    move "false"       to        app-altera-success-resp
                    string "Serviço indisponível - "
                    gnr-dtMessage      into      app-altera-message-resp                                          
                    go                 altera-cliente-ex
           end-if.
           rewrite  7171cadas.         
           if       not valid-s717
                    perform            erro-estendido
                    move "false"       to      app-altera-success-resp
                    string
                    "Serviço Indisponível(ac-s717-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-altera-message-resp
                    go                 altera-cliente-ex.
           move     "true"             to     app-altera-success-resp.
           string
                    "Atualização concluída com Sucesso."
                                       delimited by size
                                       into   app-altera-message-resp.
           move     "true"             to     app-altera-token-resp.                                                                     
                    
       
       altera-cliente-ex.
           exit.  
      *-----------------------------------------------------------------
       crediario-cliente.
           copy     "cdatahj".
           initialize                  ws-crediario-cliente-resp.
           close    s017.
           open     i-o                s017.
           if       not valid-s017
                    perform            erro-estendido
                    move "false"       to     app-crediario-success-resp
                    string
                    "Serviço Indisponível(ab-s017-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into   app-crediario-message-resp
                    go                 crediario-cliente-ex.
           close    s717.
           open     i-o                s717.
           if       not valid-s717
                    perform            erro-estendido
                    move "false"       to     app-crediario-success-resp
                    string
                    "Serviço Indisponível(ab-s717-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into   app-crediario-message-resp
                    go                 crediario-cliente-ex.
           move     app-crediario-token-in to       aux-token.
           move     aux-t3             to           7171codcl.
           read     s717  with         no lock.
           if       not valid-s717
                    initialize         7171cadas.
           if       app-crediario-token-in  not equal  7171token
                    perform            erro-estendido
                    move "false"        to    app-crediario-success-resp
                    string
                    "Token Inválido, Você será Desconectado."
                                       delimited by size
                                       into   app-crediario-message-resp
                    move "false"       to     app-crediario-token-resp                                       
                    go                 crediario-cliente-ex.
           move     "true"             to      app-crediario-token-resp.                              

           move     7171codcl          to           0171codcl.
           read     s017   with        no lock.
           if       not valid-s017
                    perform            erro-estendido
                    move "false"       to     app-crediario-success-resp
                    string
                    "Serviço Indisponível(ac-s017-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                    app-crediario-token-in delimited by size
                                       into   app-crediario-message-resp
                    move "true"        to      app-crediario-token-resp                                       
                    go                 crediario-cliente-ex.
                    
           move     function trim(app-crediario-nomeMae-in)
                                       to           0171maecl.  
           move     app-crediario-sexo-in
                                       to           0171sexcl.     
           move     function trim (app-crediario-escola-in)
                                       to           7171escolaridade.   
           move     function trim (app-crediario-locTrab-in)
                                       to           0171local.  
           move     function trim (app-crediario-profissao-in)
                                       to           0171cargo.                                                 
           move     function trim (app-crediario-estCiv-in)
                                       to           0171estcv. 
           if       app-crediario-estCiv-in         
                                       equal        "Separado"
                    move "E"           to           0171estcv.                                                                                          
           move     function trim(app-crediario-nomConj-in)  
                                       to           0171nomcj.
           move     function trim(app-crediario-cpfConj-in)
                                       to           0171cpfcj. 
           move     function trim(app-crediario-renda-in)   
                                       to           alf-valor.            
           INSPECT  alf-valor          REPLACING ALL ',' BY '.'           
           CALL     "C$JUSTIFY"        USING        alf-valor, 'R'.
           MOVE     ED-VALORD          TO           0171salar.
           
           copy     "cdatahj".
           move     hoje-data          to           aux-data
           move     aux-dia            to           inv-dia.
           move     aux-mes            to           inv-mes.
           move     aux-ano            to           inv-ano.
           move     inv-data           to           0177datal.  
           rewrite  7171cadas.
           perform  s017-rewrite.                  
           
           move     "true"             to     app-crediario-success-resp
           move     "OK"               to     app-crediario-message-resp
           move     "true"             to      app-crediario-token-resp.
           
           if       0171codcl          equal        452237
                    go                 crediario-cliente-ex.                
           
           perform  gera-solicitacao.

       crediario-cliente-ex.
           exit.  
      *-----------------------------------------------------------------
       upload-imagens.
           initialize                  imagens-out.
           close    s017.
           open     i-o                s017.
           if       not valid-s017
                    perform            erro-estendido
                    move "false"       to     app-ima-success-resp
                    string
                    "Serviço Indisponível(ab-s017-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into   app-ima-message-resp
                    go                 upload-imagens-ex.
           close    s717.
           open     i-o                s717.
           if       not valid-s717
                    perform            erro-estendido
                    move "false"       to     app-ima-success-resp
                    string
                    "Serviço Indisponível(ab-s717-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into   app-ima-message-resp
                    go                 upload-imagens-ex.
           move     app-imagens-token-in to         aux-token.
           move     aux-t3             to           7171codcl.
           read     s717  with         no lock.
           if       not valid-s717
                    initialize         7171cadas.
           if       app-imagens-token-in  not equal  7171token
                    perform            erro-estendido
                    move "false"        to    app-ima-success-resp
                    string
                    "Token Inválido, Você será Desconectado."
                                       delimited by size
                                       into   app-ima-message-resp
                    move "false"       to     app-ima-token-resp                                       
                    go                 upload-imagens-ex.
           move     "true"             to      app-ima-token-resp.                              

           move     7171codcl          to           0171codcl.
           read     s017   with        no lock.
           if       not valid-s017
                    perform            erro-estendido
                    move "false"       to     app-ima-success-resp
                    string
                    "Serviço Indisponível(ac-s017-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into   app-ima-message-resp
                    move "true"        to      app-ima-token-resp                                       
                    go                 upload-imagens-ex.
           
           move     "true"             to           app-ima-success-resp
           move     "OK"               to           app-ima-message-resp
           move     "true"             to           app-ima-token-resp.
           
           
           if       app-selfCliente-in not equal    spaces
                    set stringBase64   to           
                                       JString:>new(app-selfCliente-in)
                    move 1             to           aux-seq  
           else                                                                          
           if       app-imaDocumento-in not equal    spaces
                    set stringBase64   to           
                                       JString:>new(app-imaDocumento-in)
                    move 2             to           aux-seq
           else                                   
           if       app-imaAssinatura-in not equal    spaces
                    set stringBase64   to           
                                      JString:>new(app-imaAssinatura-in)
                    move 3             to           aux-seq
           else                                 
           if       app-imaEndereco-in not equal    spaces
                    set stringBase64   to           
                                       JString:>new(app-imaEndereco-in)
                    move 4             to           aux-seq
           else                                   
           if       app-imaRenda-in    not equal    spaces     
                    set stringBase64   to           
                                       JString:>new(app-imaRenda-in)
                    move 5             to           aux-seq
           end-if.                           

           try 

           
           set      stringBase64       to           
                    stringBase64:>replaceAll("\n", "")
           set      decodeBytes        to           
                    Base64:>getDecoder():>decode(stringBase64)            
           
           accept   aux-dat            from         date YYYYMMDD
           move     0171codcl          to           aux-codclnum
           move     function trim(aux-codclnum)       
                                       to           aux-codclinum
                     
           string   aux-codclinum 0171digcl
                                       delimited    by size
                    "-"                delimited    by size
                    aux-dat            delimited    by size
                    "-"                delimited    by size
                    aux-seq            delimited    by size
                    ".jpg"             delimited    by size
                    into               aux-image-file
           string   doc-cred           delimited    by size 
                    aux-image-file     delimited    by size
                    into               aux-image-file                               
           set      imagemFile         to
                                       JString:>new(aux-image-file)
           
           FileUtils:>writeByteArrayToFile(
                    JFile:>new(imagemFile), decodeBytes)
           
           catch exception
                    move "false"       to           app-ima-success-resp
                    move exception-object:>getMessage()            
                                       to           app-ima-message-resp
                    move "false"       to           app-ima-token-resp
                    go                 upload-imagens-ex          
           end-try.          
           
       upload-imagens-ex.
           exit.  
      *-----------------------------------------------------------------
       verifica-existencia.
           initialize                  i-existe
                                       2571cadas.       
           perform  captura-data-hora.
           move     zeros              to           date-hora.
           move     0171codcl          to           2571codcli.
           move     date-info          to           2571data.
           start    s257  key is       >=           key02.
           perform until exit
              read s257 next with no lock
              if not valid-s257
              or 2571codcli            <>           0171codcl
                 exit perform
              end-if
              if 2571filial            <>           1
              or 2571situamat          <>           "P"
              or 2571tipped            <>           "A"
                 exit perform cycle
              end-if
              move 1                   to           i-existe
              exit perform
           end-perform.
      *-----------------------------------------------------------------
       gera-solicitacao.
           close    s257.
           open     i-o                s257.
           if       not valid-s257
                    perform            erro-estendido
                    move "false"       to           app-ima-success-resp
                    string
                    "Serviço Indisponível(ab-s257-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into         app-ima-message-resp
                    move "true"        to           app-ima-token-resp
                    exit               paragraph.  
           perform  verifica-existencia. 
           if       i-existe           equal        1
                    exit               paragraph.                   
           perform  pega-numero-solicitacao.
           perform  captura-data-hora.
           move     date-info          to           2571data.
           move     "Cliente APP"      to           2571solicitante.
           move     0171codcl          to           2571codcli.
           move     zeros              to           2571codped.
           move     "A"                to           2571tipped
                                                    2571situafil.
           move     "M"                to           2571envmat.
           move     "P"                to           2571situamat
           move     "I"                to           2571regat.
           move  "Solicitação de analise de crédito via APP Lojas Solar"
                                       to           2571parecer.
           move     0171salar          to           2571valor.
           write    2571cadas.
           if       not valid-s257
                    perform            erro-estendido
                    move "false"       to           app-ima-success-resp
                    string
                    "Serviço Indisponível(wr-s257-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into         app-ima-message-resp
                    move "true"        to           app-ima-token-resp
                    exit               paragraph.                                       
      *-----------------------------------------------------------------
       pega-numero-solicitacao.             
           initialize                  2571cadas.
           move     1                  to           2571filial
           move     999999999999999999 to           2571codsol
           start    s257 key is        not greater  2571chave
           read     s257 previous with no lock
           if       not valid-s257
           or       2571filial         not equal    1
                    move 1             to           2571filial
                    move zeros         to           2571codsol.
           initialize                  2571data
                                       2571solicitante
                                       2571codcli     
                                       2571codped     
                                       2571tipped     
                                       2571valor      
                                       2571dtinifil   
                                       2571dtfinfil   
                                       2571anafil     
                                       2571resana     
                                       2571situafil   
                                       2571dtenvmat   
                                       2571dtenvfil   
                                       2571dtinimat   
                                       2571dtfinmat   
                                       2571anamat     
                                       2571situamat   
                                       2571envmat     
                                       2571codlib     
                                       2571senniv     
                                       2571resultado  
                                       2571parecer    
                                       2571regat
                                       2571alterped.
           add 1                       to           2571codsol.
      *-----------------------------------------------------------------
       lista-estado-civil.
           initialize                  ws-lista-estciv-resp.
           move     "true"             to       app-estciv-success-resp.
           move     "OK"               to       app-estciv-message-resp.
           move     1                  to       civ.
           move     "Solteiro"         TO       app-estciv-resp(civ).
           move     2                  to       civ.
           move     "Casado"           TO       app-estciv-resp(civ).
           move     3                  to       civ.
           move     "Viúvo"            TO       app-estciv-resp(civ).
           move     4                  to       civ.
           move     "Separado"         TO       app-estciv-resp(civ).
           move     5                  to       civ.
           move     "Divorciado"       TO       app-estciv-resp(civ).
           
           
           move     "true"             to       app-estciv-success-resp.
           move     "OK"               to       app-estciv-message-resp.
      *-----------------------------------------------------------------
       lista-escolaridade.
           initialize                  ws-lista-escolaridade-resp.
           move     "true"             to       app-escolar-success-resp
           move     "OK"               to       app-escolar-message-resp
           move     1                  to       esc.
           move     "Analfabeto"       TO       app-escolar-resp(esc).
           move     2                  to       esc.
           move     "Alfabetizado"     TO       app-escolar-resp(esc).
           move     3                  to       esc.
           move     "Fundamental Incompleto"            
                                       TO       app-escolar-resp(esc).
           move     4                  to       esc.
           move     "Fundamental"      TO       app-escolar-resp(esc).
           move     5                  to       esc.
           move     "Médio Incompleto" TO       app-escolar-resp(esc).
           move     6                  to       esc.
           move     "Médio"            TO       app-escolar-resp(esc).
           move     7                  to       esc.
           move     "Técnico Nível Médio" 
                                       TO       app-escolar-resp(esc).
           move     8                  to       esc.
           move     "Superior Incompleto" 
                                       TO       app-escolar-resp(esc).
           move     9                  to       esc.
           move     "Superior"         TO       app-escolar-resp(esc).
           move     10                 to       esc.
           move     "Aperfeiçoamento"  TO       app-escolar-resp(esc).
           move     11                 to       esc.
           move     "Especialização"   TO       app-escolar-resp(esc).
           move     12                 to       esc.
           move     "Mestrado"         TO       app-escolar-resp(esc).
           move     13                 to       esc.
           move     "Doutorado"        TO       app-escolar-resp(esc).
           
           move     "true"             to      app-escolar-success-resp.
           move     "OK"               to      app-escolar-message-resp.
      *-----------------------------------------------------------------
       lista-profissao.
           initialize                  ws-lista-profissao-resp.
           close    sce014.
           open     input              sce014.
           if       not valid-sce014
                    perform            erro-estendido
                    move "false"       to     app-profissao-success-resp
                    string
                    "Serviço Indisponível(ab-sce014-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into   app-profissao-message-resp
                    go                 lista-profissao-ex.
           move     zeros              to           pro.                    
       lprof-10.
           read     sce014 next with   no lock      at end
                    go                 lprof-20.
           if       not valid-sce014
                    perform            erro-estendido
                    move "false"       to     app-profissao-success-resp
                    string
                    "Serviço Indisponível(ac-sce014-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into   app-profissao-message-resp
                    go                 lista-profissao-ex.
           add      1                  to           pro.
           move     function trim(sce014-profissao)
                                       to        app-profissao-resp(pro)
           go       lprof-10. 
       lprof-20.
           move     "true"             to    app-profissao-success-resp.
           move     "OK"               to    app-profissao-message-resp.
                                                                                                  
       lista-profissao-ex.
           exit.
      *-----------------------------------------------------------------
       ordem-pagamento.
           initialize                  ws-ordem-pagamento-resp.
           close    s017.
           open     input              s017.
           if       not valid-s017
                    perform            erro-estendido
                    move "false"       to      app-ord-success-resp
                    string
                    "Serviço Indisponível(ab-s017-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-ord-message-resp
                    go                 ordem-pagamento-ex.
           close    s207.
           open     input              s207.
           if       not valid-s207
                    perform            erro-estendido
                    move "false"       to      app-ord-success-resp
                    string
                    "Serviço Indisponível(ab-s207-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-ord-message-resp
                    go                 ordem-pagamento-ex.
           close    s717.
           open     i-o                s717.
           if       not valid-s717
                    perform            erro-estendido
                    move "false"       to      app-ord-success-resp
                    string
                    "Serviço Indisponível(ab-s717-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-ord-message-resp
                    go                 ordem-pagamento-ex.
           move     app-ord-pagamento-token-in to     aux-token.
           move     aux-t3             to           7171codcl.
           read     s717  with         no lock.
           if       not valid-s717
                    initialize         7171cadas.
           if       app-ord-pagamento-token-in  not equal  7171token
                    perform            erro-estendido
                    move "false"        to      app-ord-success-resp
                    string
                    "Token Inválido, Você será Desconectado."
                                       delimited by size
                                       into    app-ord-message-resp
                    move "false"       to      app-ord-token-resp                                       
                    go                 ordem-pagamento-ex.
           move     "true"             to      app-ord-token-resp. 
           
           move     7171codcl          to           0171codcl.
           read     s017   with        no lock.
           if       not valid-s017
                    perform            erro-estendido
                    move "false"       to      app-ord-success-resp
                    string
                    "Serviço Indisponível(ac-s017-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-ord-message-resp
                    go                 ordem-pagamento-ex.

           move     "true"             to      app-ord-success-resp.
           perform  valida-dados-cartao
                                       thru         vdados-cartao-ex.
           if       app-ord-success-resp equal      "false"
                    go                 ordem-pagamento-ex.                                                       




                    
           move     0171codcl          to           aux-numcl.
           move     0171digcl          to           aux-digcl.                                       
       
           close    sce004.
           open     i-o                sce004.
           if       not valid-sce004
                    perform            erro-estendido
                    move "false"       to      app-ord-success-resp
                    string
                    "Serviço Indisponível(ab-sce004-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-ord-message-resp
                    go                 ordem-pagamento-ex.
       
           close    sce005.
           open     i-o                sce005.
           if       not valid-sce005
                    perform            erro-estendido
                    move "false"       to      app-ord-success-resp
                    string
                    "Serviço Indisponível(ab-sce005-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-ord-message-resp
                    go                 ordem-pagamento-ex.
           initialize                  ws-ordem-pagamento-resp.
           perform  consiste-parcelas  thru         cparcelas-ex.
           move     "true"             to      app-ord-token-resp. 
           if       app-ord-success-resp equal      "false"
                    go                 ordem-pagamento-ex.  
       
           add      zeros              to           ac-conta.
       opagamento-10.      
           initialize                  sce004-reg.                    
           move     9999999999         to           sce004-numord.
           read     sce004.
           if       stat-sce004        equal        "99"
                    call "c$sleep"     using        1
                    add 1              to           ac-conta
               if   ac-conta           equal        5
                    perform            erro-estendido
                    move "false"       to      app-ord-success-resp
                    string
                    "Serviço Indisponível(ac-sce004-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                    "Head"             delimited by size
                                       into    app-ord-message-resp
                    go                 ordem-pagamento-ex
               else
                    go                 opagamento-10.
           if       not valid-sce004
                    move zeros         to           sce004-datord
                    write              sce004-reg.                                      
           add      1                  to           sce004-datord.
           move     sce004-datord      to           aux-numord.
           rewrite  sce004-reg.                                          
           if       not valid-sce004
                    perform            erro-estendido
                    move "false"       to      app-ord-success-resp
                    string
                    "Serviço Indisponível(wr-sce004-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-ord-message-resp
                    go                 ordem-pagamento-ex.
           move     app-ord-valor-in   to           alf-valor.                               
           INSPECT  alf-valor          REPLACING ALL ',' BY '.'           
           CALL     "C$JUSTIFY"        USING        alf-valor, 'R'.
           MOVE     ED-VALORD          TO           ORD-VALOR.
                    
       opagamento-20.
           move     zeros              to           par
                                                    ac-total.
       opagamento-30.
           add      1                  to           par.  
           if       par                greater      par-num
                    go                 opagamento-40.
           initialize                  sce005-reg.                    
           move     aux-codcl          to           sce005-codcl.                              
           move     app-ord-filial-r(par) to        sce005-filia.                 
           move     app-ord-numeroCarne-r(par) to   sce005-codca.           
           move     app-ord-parcela-r(par) to       sce005-numpr.
           move     aux-numord          to          sce005-numord.
           move     app-ord-vlprest-r(par)   to     sce005-valpr.
           move     app-ord-acrescimo-r(par) to     sce005-acres.
           write    sce005-reg.
           if       not valid-sce005
                    perform            erro-estendido
                    move "false"       to      app-ord-success-resp
                    string
                    "Serviço Indisponível(wr-sce005-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-ord-message-resp
                    go                 ordem-pagamento-ex.
           add      sce005-valpr       to           ac-total.
           add      sce005-acres       to           ac-total.                         
           go       opagamento-30.      
       opagamento-40.
      *     if       ord-valor          not equal    ac-total
      *              move "false"       to      app-ord-success-resp
      *              string
      *              "Não foi possível gerar Ordem de Pagamento(tt-"
      *                                 delimited by size
      *              "difval"           delimited by size                   
      *              ")"                delimited by size
      *                                 into    app-ord-message-resp
      *              perform limpa-scr005 thru       lsce005-ex                                       
      *              go                 ordem-pagamento-ex.
           move     "true"             to          app-ord-token-resp. 
           copy     "cdatahj".
           move     hj-dia             to           inv-dia.         
           move     hj-mes             to           inv-mes.         
           move     hj-ano             to           inv-ano.         
           move     aux-numord         to           sce004-numord.
           move     inv-data           to           sce004-datord
           move     aux-codcl          to           sce004-codcl
           move     0172nomcl          to           sce004-nomcl
           move     spaces             to           sce004-idtran
           move     spaces             to           sce004-stapag
           move     "P"                to           sce004-staord
           move     zeros              to           sce004-datliq
           move     ac-total           to           sce004-valord.
           move     app-ord-tppgt-in   to           sce004-tppgt.
           move     "N"                to           sce004_juncao.
           move     aux-time           to           sce004_horger.
           write    sce004-reg.   
           if       not valid-sce004
                    perform            erro-estendido
                    move "false"       to      app-ord-success-resp
                    string
                    "Serviço Indisponível(wr-sce004-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-ord-message-resp
                    go                 ordem-pagamento-ex.
           move     ac-total           to          ed-total
           move     function trim(ed-total) to     app-ord-valor-resp.           
           move     aux-numord         to          app-ord-numero-resp.
           move     function trim(7171cpfcnpj)
                                       to          app-ord-cpfcnpj-resp
           move     spaces             to           ws-dados.                                       
           move     0172nomcl          to           ws-dados.
           perform  limpa-espacos      thru         lespacos-ex.
           move     spaces             to           0172nomcl.
           move     wk-dados           to           0172nomcl.                                                       
           
           
      *     if       aux-codcl          equal        644110
      *              set aux-string     to           0172nomcl
      *              go                 tira-carac-especiais.
                    
       opagamento-50.    
           
           move     function trim(0172nomcl)
                                       to          app-ord-nome-resp.

           IF       0172nomcl          EQUAL        SPACES
                    move "false"       to           app-ord-success-resp
                    move "Verifique seu dados Cadstrais."
                                       to           app-ord-message-resp
                    go                 ordem-pagamento-ex.                                                               
                                                  

                                       
           move     spaces             to           ws-dados.                                       
           move     0171endcl          to           ws-dados.
           perform  limpa-espacos      thru         lespacos-ex.
           move     spaces             to           0171endcl.
           move     wk-dados           to           0171endcl.                                                       
           move     function trim(0171endcl)
                                       to          app-ord-endereco-resp
                                       
           IF       0171ENDCL          EQUAL        SPACES
                    move "false"       to           app-ord-success-resp
                    move "Verifique seu dados Cadstrais."
                                       to           app-ord-message-resp
                    go                 ordem-pagamento-ex.                                                               

           move     spaces             to           ws-dados.                                       
           move     0171numer          to           ws-dados.
           perform  limpa-espacos      thru         lespacos-ex.
           move     spaces             to           0171numer.
           move     wk-dados           to           0171numer
           
           IF       0171NUMER          EQUAL        SPACES
                    MOVE "SN"          TO           0171NUMER.          
           move     function trim(0171numer)
                                       to     app-ord-numeroCliente-resp  

           move     spaces             to           ws-dados.                                       
           move     0171baicl          to           ws-dados.
           perform  limpa-espacos      thru         lespacos-ex.
           move     spaces             to           0171baicl.
           move     wk-dados           to           0171baicl.                                                       
           move     function trim(0171baicl)
                                       to     app-ord-bairroCliente-resp
           
           if       0171baicl          equal        spaces
                    move "false"       to           app-ord-success-resp
                    move "Verifique seu dados Cadstrais."
                                       to           app-ord-message-resp
                    go                 ordem-pagamento-ex
           end-if.                            
                                             
           move     0171cepcl          to           app-ord-cep-resp.
           move     function trim(0171cidcl)
                                       to           app-ord-cidade-resp
                                       
           IF       0171cidcl          EQUAL        SPACES
                    move "false"       to           app-ord-success-resp
                    move "Verifique seu dados Cadstrais."
                                       to           app-ord-message-resp
                    go                 ordem-pagamento-ex.                                                               
                                       
                                       
           move     function trim(0171estcl)
                                       to           app-ord-uf-resp                     
           move     function trim(7171email)
                                       to           app-ord-email-resp.
           move     0171nascl          to           ed-data.
           move     function trim(ed-data)
                                       to           app-ord-dtnasc-resp
           string
                    aux-numcartao(1:4) delimited by size
                    " "                delimited by size
                    aux-numcartao(5:4) delimited by size
                    " "                delimited by size
                    aux-numcartao(9:4) delimited by size
                    " "                delimited by size
                    aux-numcartao(13:4) delimited by size
                                       into      app-ord-numcartao-resp.                  
                    
           move     function trim(aux-nomcartao)
                                       to        app-ord-nomcartao-resp.
           move     function trim(ed-datval)
                                       to        app-ord-valCartao-resp.                                                                      
           move     function trim(aux-cvvcartao)
                                       to        app-ord-cvvCartao-resp.       
                                             
                                                        
                                             
                                                                                                                                                                                    
           move     "true"             to          app-ord-success-resp.
           move     "OK"               to          app-ord-message-resp. 
           move     "true"             to          app-ord-token-resp. 

      *     if       aux-codcl          equal        644110
      *              move "false"       to           app-ord-success-resp
      *              move app-ord-nome-resp to       app-ord-message-resp.           


           
           move     1                  to           i-sce012.
           move     sce004-codcl       to           aux-codcl.
           perform  verifica-sce012    thru         vsce012-ex.
       ordem-pagamento-ex.
           exit.
      *-----------------------------------------------------------------
       valida-dados-cartao.
           move     app-ord-tppgt-in   to           sce004-tppgt.
           if       (sce004-tppgt = 1 or 4)
                    go                 vdados-cartao-ex.
           if       app-ord-vdados-in  not equal    "S"
                    go                 vdados-cartao-ex.                                
           copy     "cdatahj".
           move     hj-mes             to           ref-mes1.
           move     hj-ano             to           ref-ano1.                    

           move     zeros              to           i j.                                                    
           move     spaces             to           ws-dados
                                                    wk-dados.                                 
           move     app-ord-numcartao-in 
                                       to           ws-dados
           perform  limpa-numeros      thru         lnumeros-ex.
           move     spaces             to           aux-numcartao.        
           move     wk-dados           to           aux-numcartao.         
           if       aux-numcartao(16:1) equal       spaces
                    move "false"       to      app-ord-success-resp
                    string
                    "Número do Cartão é Inválido, Verifique os dados."
                                       delimited by size
                                       into    app-ord-message-resp
                    go                 vdados-cartao-ex. 
           if       sce004-tppgt       equal        3
           and   (aux-numcartao(1:6) = "476331" or "476332" or "476333"
                    or "639664" or "534520" or "637529")
                    move "false"       to      app-ord-success-resp
                    string
                    "Cartão não Permitido para Pagamento a Débito."
                                       delimited by size
                                       into    app-ord-message-resp
                    go                 vdados-cartao-ex. 
                    
                    
                    
                    
           move     spaces             to           ws-dados.                                       
           move     app-ord-nomcartao-in to         ws-dados.
           perform  limpa-espacos      thru         lespacos-ex.
           move     spaces             to           aux-nomcartao.
           move     wk-dados           to           aux-nomcartao.                                                       
                    
           move     zeros              to           i j.
           move     spaces             to           ws-dados
                                                    wk-dados.                                 
           move     app-ord-valCartao-in 
                                       to           ws-dados
           perform  limpa-numeros      thru         lnumeros-ex.
           move     spaces             to           aux-valcartao.        
           move     wk-dados           to           aux-valcartao.         


           if       aux-valcartao(6:1) equal        spaces
              if    aux-valcartao(5:1) not equal    spaces
                    move "false"       to      app-ord-success-resp
                    string
                    "Data de Validade do Cartão é Inválida, Verifique."
                                       delimited by size
                                       into    app-ord-message-resp
                    go                 vdados-cartao-ex.

           if       aux-valcartao(5:1) equal        spaces
                    move aux-valcartao(3:2)
                                       to           val-a2.
           if       aux-valcartao(6:1) not equal    spaces
                    move aux-valcartao(5:2)
                                       to           val-a2.
                                       
                                       
                                       
           move     20                 to           val-a1                              
           move     aux-valcartao(1:2) to           val-m1.
                                       
           move     val-m1             to           ref-mes2.
           move     val-aa             to           ref-ano2.                                       
           if       data-ref2          less         data-ref1                            
                    move "false"       to      app-ord-success-resp
                    string
                    "Data de Validade do Cartão é Inválida, Verifique."
                                       delimited by size
                                       into    app-ord-message-resp
                    go                 vdados-cartao-ex.
                    
           move     dat-validade       to           ed-datval.
           move     spaces             to           aux-valcartao.
           move     ed-datval          to           aux-valcartao.                               

           move     zeros              to           i j.
           move     spaces             to           ws-dados
                                                    wk-dados.                                 
           move     app-ord-cvvCartao-in 
                                       to           ws-dados
           perform  limpa-numeros      thru         lnumeros-ex.
           move     spaces             to           aux-valcartao.        
           move     wk-dados           to           aux-cvvcartao.         
           if       aux-cvvcartao      equal        spaces
                    move "false"       to      app-ord-success-resp
                    string
                    "Código de Segurança é Inválido, Verifique."
                                       delimited by size
                                       into    app-ord-message-resp
                    go                 vdados-cartao-ex.
           if       aux-cvvcartao(2:1) equal        spaces
                    move "false"       to      app-ord-success-resp
                    string
                    "Código de Segurança é Inválido, Verifique."
                                       delimited by size
                                       into    app-ord-message-resp
                    go                 vdados-cartao-ex.
           if       aux-cvvcartao(3:1) equal        spaces
                    move "false"       to      app-ord-success-resp
                    string
                    "Código de Segurança é Inválido, Verifique."
                                       delimited by size
                                       into    app-ord-message-resp
                    go                 vdados-cartao-ex.
       vdados-cartao-ex.
           exit.
      *-----------------------------------------------------------------
       limpa-scr005.
           initialize                  sce005-reg.
           move     aux-numord         to           sce005-numord.
           start    sce005  key is     not less     sce005-chave
                    invalid            go           lsce005-ex.
       lsce005-10.
           read     sce005  next  with no lock      at end
                    go                 lsce005-ex.
           if       aux-numord         not equal    sce005-numord
                    go                 lsce005-ex.
           delete   sce005             record.
           go       lsce005-10.                                                                              
       lsce005-ex.
           exit.                                       
      *-----------------------------------------------------------------
       consiste-parcelas.
           move     zeros              to           par.
       cparcelas-10.
           add      1                  to           par.  
           if       par                greater      par-num
                    go                 cparcelas-ex.
           move     app-ord-parcela-r(par) to       w-p.         
           move     app-ord-filial-r(par) to        2071codfl.
           move     aux-codcl          to           2071codcl.
           move     app-ord-numeroCarne-r(par) to   2071codca.
           read     s207   with        no lock
           if       not valid-s207
                    perform            erro-estendido
                    move "false"       to      app-ord-success-resp
                    string
                    "Parcela não Localizada(ac-s207-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")-"               delimited by size
                    2071codca          delimited by "   "
                    "/"                delimited by size
                    app-ord-parcela-r(par) delimited by size
                                       into    app-ord-message-resp
                    go                 cparcelas-ex.
           if       2071valor(w-p)     equal        zeros
                    move "false"       to      app-ord-success-resp
                    string
                    "Parcela não Localizada(par-null)"
                                       delimited by size
                    ")-"               delimited by size
                    2071codca          delimited by "   "
                    "/"                delimited by size
                    app-ord-parcela-r(par) delimited by size
                                       into    app-ord-message-resp
                    go                 cparcelas-ex.
                               
                    
                    
                    
           move     aux-codcl          to           sce005-codcl.                              
           move     app-ord-filial-r(par) to        sce005-filia.                 
           move     app-ord-numeroCarne-r(par) to   sce005-codca.           
           move     app-ord-parcela-r(par) to       sce005-numpr.
           move     zeros              to           sce005-numord.
           start    sce005  key is     not less     key01
                    invalid            go           cparcelas-10.                          
       cparcelas-20.
           read     sce005 next  with  no lock      at end
                    go                 cparcelas-10.
           if       not valid-sce005
                    perform            erro-estendido
                    move "false"       to      app-ord-success-resp
                    string
                    "Serviço Indisponível(ac-sce005-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-ord-message-resp
                    go                 cparcelas-ex.
           if       aux-codcl          not equal      sce005-codcl                            
                    go                 cparcelas-10.
           if       app-ord-filial-r(par) not equal   sce005-filia
                    go                 cparcelas-10.
           if       app-ord-numeroCarne-r(par) not equal sce005-codca          
                    go                 cparcelas-10.
           if       app-ord-parcela-r(par) not equal    sce005-numpr
                    go                 cparcelas-10.
                    
           move     sce005-numord      to           sce004-numord.
           read     sce004  with       no lock.
           if       not valid-sce004
                    perform            erro-estendido
                    move "false"       to      app-ord-success-resp
                    string
                    "Serviço Indisponível(ac-sce004-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-ord-message-resp
                    go                 cparcelas-ex.
           if       not (sce004-staord  = "A" or "P")
                    go                 cparcelas-20.                                    
           move     "false"            to      app-ord-success-resp
           string
                    "Erro ao Gerar Ordem de Pagamento-DPLst22-"
                                       delimited by size
                    sce005-filia       delimited by size
                    "-"                delimited by size                   
                    sce005-codca       delimited by spaces
                    "/"                delimited by size
                    sce005-numpr       delimited by size
                                       into    app-ord-message-resp.
                                                  
       cparcelas-ex.
           exit.                    
      *-----------------------------------------------------------------
       atualiza-ordem.
           initialize                  ws-atualiza-ordem-resp.
           close    sce004.
           open     i-o                sce004.
           if       not valid-sce004
                    perform            erro-estendido
                    move "false"       to    app-atu-ordpag-success-resp
                    string
                    "Serviço Indisponível(ab-sce004-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into  app-atu-ordpag-message-resp
                    go                 atualiza-ordem-ex.
           if       app-atu-ordpag-token-in
                                   not equal    91362590064312210014616                    
                    move "false"       to    app-atu-ordpag-success-resp
                    string
                    "token inválido, você será desconectado."
                                       delimited by size
                                       into  app-atu-ordpag-message-resp
                    move "false"       to    app-atu-ordpag-token-resp                                              
                    go                 atualiza-ordem-ex.
           move     "true"             to    app-atu-ordpag-token-resp.                                    
           move     function numval(app-atu-ordpag-num-in)
                                       to           sce004-numord.
                                       
           if       sce004-idtran       not equal
                    "00000000-0000-0000-0000-000000000000"
           and      sce004-numord      not greater  zeros
                    move     app-atu-ordpag-id-in
                                       to           sce004-idtran
                    read sce004        key is       key04
                if  not (stat-sce004 = "00" or "02")
                    perform            erro-estendido
                    move "false"       to    app-atu-ordpag-success-resp
                    string
                    "Ordem não Localizada(ac-sce004-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into  app-atu-ordpag-message-resp
                    go                 atualiza-ordem-ex.
                                                
                                       
                                       
       atualiza-ordem-10.
           read     sce004.
           if       stat-sce004        equal        "99"
                    perform            erro-estendido
                    move "false"       to    app-atu-ordpag-success-resp
                    string
                    "Serviço Indisponível(ac-sce004-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into  app-atu-ordpag-message-resp
                    go                 atualiza-ordem-ex.
           move     app-atu-ordpag-sta-in
                                       to           sce004-stapag.
           move     app-atu-ordpag-id-in
                                       to           sce004-idtran.
      *     move     app-atu-tppgt-id-in
      *                                 to           sce004-tppgt.
      
      
           if       (sce004-stapag = "2")
           AND      NOT (sce004-staord = "B" OR "J")
               if   sce004-tppgt       equal        3
                    move "L"           to           sce004-staord
               else     
                    move "A"           to           sce004-staord.

           if       (sce004-stapag = "3" or "10" or "11" or "13")
           AND      sce004-staord      equal        "P"
               if   sce004-tppgt       equal        3
                    move "X"           to           sce004-staord
               else     
                    move "E"           to           sce004-staord.
                          
           if       sce004-idtran       equal
                    "00000000-0000-0000-0000-000000000000"
           AND      sce004-staord      equal        "P"
               if   sce004-tppgt       equal        3
                    move "X"           to           sce004-staord
               else     
                    move "E"           to           sce004-staord.                                                                   
      
           move     app-atu-urlboleto-id-in
                                       to           sce004-urlboleto. 
           move     "true"             to    app-atu-ordpag-token-resp.
                                             
           rewrite  sce004-reg.
           if       not valid-sce004                                                                                                                                                      
                    perform            erro-estendido
                    move "false"       to    app-atu-ordpag-success-resp
                    string
                    "Serviço Indisponível(wr-sce004-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into  app-atu-ordpag-message-resp
                    go                 atualiza-ordem-ex.
                    
           move     "true"             to    app-atu-ordpag-success-resp
           move     "OK"               to    app-atu-ordpag-message-resp
           move     "true"             to    app-atu-ordpag-token-resp.
           
       atualiza-ordem-ex.
           exit.  
      *-----------------------------------------------------------------
       notifica-erro-debito.
           close    sce002.
           open     input              sce002.
           close    sce004.
           open     i-o                sce004.
           initialize                  sce004-reg.
           move     "X"                to           sce004-staord.
           start    sce004  key is     not less     key06
                    invalid            go       not-erro-debito-20.
       not-erro-debito-10.
           read     sce004  next with  no lock      at end
                    go                 not-erro-debito-20.
           if       sce004-staord      not equal    "X"
                    go                 not-erro-debito-20.
           initialize                  sce002-reg.         
           move     sce004-codcl       to           aux-codcl
           move     aux-numcl          to           sce002-codcl.
           start    sce002  key is     not less     key01
                    invalid            go           not-erro-debito-17.
       not-erro-debito-15.
           read     sce002  next with  no lock      at end
                    go                 not-erro-debito-17.
           if       aux-numcl          not equal    sce002-codcl
                    go                 not-erro-debito-17.
           copy     "cdatahj".
           if       sce002-datcad      not equal    hoje-data
                    go                 not-erro-debito-15.                                                        
           move     sce004-valord      to           ed-valor.
           if       sce004-tppgt       equal        3
           and      sce004-staord      equal        "X"
                    move spaces        to           push-title-ext
                    move "Pagamento com Cartão de Débito"
                                       to           push-title-ext
                    move spaces        to           push-texto-ext
                    string
                    "Transação não Autorizada, " 
                                       delimited by size
                    "Verifique o Tipo de Cartão." delimited by size
                                       into         push-texto-ext
                    move 1             to           push-type-ext
                    move sce002-token  to           push-token-ext             
                    call               "enviopush"
                    cancel             "enviopush". 
                    
           go       not-erro-debito-15.
       not-erro-debito-17.    
           move     "E"                to           sce004-staord.
           rewrite  sce004-reg.                                                                                                                             
           go       not-erro-debito-10.
           
           
       not-erro-debito-20.
           initialize                  sce004-reg.
           move     "L"                to           sce004-staord.
           start    sce004  key is     not less     key06
                    invalid            go       notifica-erro-debito-ex.
       not-erro-debito-30.
           read     sce004  next with  no lock      at end
                    go                 notifica-erro-debito-ex.
           if       sce004-staord      not equal    "L"
                    go                 notifica-erro-debito-ex.                                       
           initialize                  sce002-reg.         
           move     sce004-codcl       to           aux-codcl
           move     aux-numcl          to           sce002-codcl.
           start    sce002  key is     not less     key01
                    invalid            go           not-erro-debito-37.
       not-erro-debito-35.
           read     sce002  next with  no lock      at end
                    go                 not-erro-debito-37.
           if       aux-numcl          not equal    sce002-codcl
                    go                 not-erro-debito-37.
           copy     "cdatahj".
           if       sce002-datcad      not equal    hoje-data
                    go                 not-erro-debito-35.                                                        
           move     sce004-valord      to           ed-valor.
           if       sce004-tppgt       equal        3
           and      sce004-staord      equal        "L"
                    move spaces        to           push-title-ext
                    move "Pagamento com Cartão de Débito"
                                       to           push-title-ext
                    move spaces        to           push-texto-ext
                    string
                    "Transação Autorizada, Agradecemos o Pagamento." 
                                       delimited by size
                                       into         push-texto-ext
                    move 1             to           push-type-ext
                    move spaces        to           push-token-ext
                    move function trim(sce002-token)
                                       to           push-token-ext             
                    call               "enviopush"
                    cancel             "enviopush".   
           go       not-erro-debito-35.
       not-erro-debito-37.    
           move     "A"                to           sce004-staord.
           rewrite  sce004-reg.  
           go       not-erro-debito-30.                                                                                                                                 
           
       notifica-erro-debito-ex.
           exit.
      *-----------------------------------------------------------------
       segunda-via-boleto.
           initialize                  ws-segunda-via-boleto-resp.      
           close    sce004.
           open     input              sce004.
           if       not valid-sce004
                    perform            erro-estendido
                    move "false"       to      app-seg-via-success-resp
                    string
                    "Serviço Indisponível(ab-sce004-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-seg-via-message-resp
                    go                 segunda-via-boleto-ex.
           close    s017.
           open     input              s017.
           if       not valid-s017
                    perform            erro-estendido
                    move "false"       to      app-seg-via-success-resp
                    string
                    "Serviço Indisponível(ab-s017-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-seg-via-message-resp
                    go                 segunda-via-boleto-ex.
           close    s717.
           open     input              s717.
           if       not valid-s717
                    perform            erro-estendido
                    move "false"       to      app-seg-via-success-resp
                    string
                    "Serviço Indisponível(ab-s717-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-seg-via-message-resp
                    go                 segunda-via-boleto-ex.
           move     app-segunda-via-token-in  
                                       to           aux-token.
           move     aux-t3             to           7171codcl.
           read     s717  with         no lock.
           if       not valid-s717
                    initialize         7171cadas.
           if       app-segunda-via-token-in  
                                       not equal    7171token
                    perform            erro-estendido
                    move "false"        to      app-seg-via-success-resp
                    string
                    "Token Inválido, Você será Desconectado."
                                       delimited by size
                                       into    app-seg-via-message-resp
                    move "false"       to      app-seg-via-token-resp                                       
                    go                 segunda-via-boleto-ex.
           move     "true"             to      app-seg-via-token-resp.                             

           move     7171codcl          to           0171codcl.
           read     s017   with        no lock.
           if       not valid-s017
                    perform            erro-estendido
                    move "false"       to      app-seg-via-success-resp
                    string
                    "Serviço Indisponível(ac-s017-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-seg-via-message-resp
                    go                 segunda-via-boleto-ex.
           move     0171codcl          to           aux-numcl.
           move     0171digcl          to           aux-digcl.
           copy     "cdatahj".
           move     hj-dia             to           inv-dia.                    
           move     hj-mes             to           inv-mes.                    
           move     hj-ano             to           inv-ano.                    
           
           subtract 1                  from         inv-dia.
           if       inv-dia            equal        zeros
                    subtract 1         from         inv-mes
               if   inv-mes            equal        zeros
                    subtract 1         from         inv-ano
                    move 12            to           inv-mes.
           if       inv-dia            equal        zeros
               if   inv-mes            equal        2
                    move 28            to           inv-dia
               else     
               if   (inv-mes = 1 or 3 or 5 or 7 or 8 or 10 or 12)
                    move 31            to           inv-dia
               else
                    move 30            to           inv-dia.                       
           move     inv-data           to           ini-data.                                           
           
           move     zeros              to           via.
           initialize                  sce004-reg. 
           move     "P"                to           sce004-staord.
           start    sce004  key is     not less     key06
                    invalid            go           segunda-via-20.
       segunda-via-10.
           read     sce004  next with  no lock      at end
                    go                 segunda-via-20.
           if       not valid-sce004
                    perform            erro-estendido
                    move "false"       to      app-seg-via-success-resp
                    string
                    "Serviço Indisponível(ac-sce004-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into    app-seg-via-message-resp
                    go                 segunda-via-boleto-ex.
           if       sce004-staord      not equal    'P'
                    go                 segunda-via-20.
           if       sce004-tppgt       not equal    1
                    go                 segunda-via-10.                                    
           if       sce004-codcl       not equal    aux-codcl
                    go                 segunda-via-10. 
           if       sce004-datord      less         ini-data
                    go                 segunda-via-10. 
           if       sce004-urlboleto   equal        spaces
                    go                 segunda-via-10.                                                               
                    
                    
           add      1                  to           via.                                                                                        
           move     sce004-numord      to           aux-numord.                   
           move     aux-numord         to  
                                      app-seg-via-numeroOrdem-resp(via).
           move     sce004-datord      to           inv-data.
           move     inv-dia            to           aux-dia.                                                                    
           move     inv-mes            to           aux-mes.                                                                    
           move     inv-ano            to           aux-ano.
           move     aux-data           to    
                                       app-seg-via-datEmissao-resp(via).                                                                           
           move     function trim(sce004-urlboleto)
                                     to app-seg-via-urlBoleto-resp(via).
           move     sce004-valord      to          ed-total
           move     function trim(ed-total) 
                                       to   app-seg-via-valor-resp(via).
           go       segunda-via-10.
           
       segunda-via-20.
           if       via                equal        zeros
                    move "false"       to      app-seg-via-success-resp
                    move "Não existe 2.via disponível, Contate o SAC"               
                                       to      app-seg-via-message-resp
           else                            
                    move "true"        to      app-seg-via-success-resp
                    move "OK"          to      app-seg-via-message-resp.
           move     "true"             to      app-seg-via-token-resp.                             
       segunda-via-boleto-ex.
           exit.      
      *-----------------------------------------------------------------
       autoriza-cliente.
           initialize                  ws-autorizacao-cliente-resp.      
           close    sce001.
           open     input              sce001.
           if       not valid-sce001
                    perform            erro-estendido
                    move "false"       to   app-aut-cliente-success-resp
                    string
                    "Serviço Indisponível(ab-sce001-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                    into    app-aut-cliente-message-resp
                    go                 autoriza-cliente-ex.
           close    sce002.
           open     input              sce002.
           if       not valid-sce002
                    perform            erro-estendido
                    move "false"       to   app-aut-cliente-success-resp
                    string
                    "Serviço Indisponível(ab-sce002-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                    into    app-aut-cliente-message-resp
                    go                 autoriza-cliente-ex.
           close    s017.
           open     input              s017.
           if       not valid-s017
                    perform            erro-estendido
                    move "false"       to   app-aut-cliente-success-resp
                    string
                    "Serviço Indisponível(ab-s017-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                    into    app-aut-cliente-message-resp
                    go                 autoriza-cliente-ex.
           close    s717.
           open     input              s717.
           if       not valid-s717
                    perform            erro-estendido
                    move "false"       to   app-aut-cliente-success-resp
                    string
                    "Serviço Indisponível(ab-s717-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                    into    app-aut-cliente-message-resp
                    go                 autoriza-cliente-ex.
           move     app-aut-cliente-token-in  
                                       to           aux-token.
           move     aux-t3             to           7171codcl.
           read     s717  with         no lock.
           if       not valid-s717
                    initialize         7171cadas.
           if       app-aut-cliente-token-in  
                                       not equal    7171token
                    perform            erro-estendido
                    move "false"        to  app-aut-cliente-success-resp
                    string
                    "Token Inválido, Você será Desconectado."
                                       delimited by size
                                       into app-aut-cliente-message-resp
                    move "false"       to     app-aut-cliente-token-resp                                       
                    go                 autoriza-cliente-ex.
           move     "true"             to    app-aut-cliente-token-resp.                             

           move     7171codcl          to           0171codcl.
           read     s017   with        no lock.
           if       not valid-s017
                    perform            erro-estendido
                    move "false"       to   app-aut-cliente-success-resp
                    string
                    "Serviço Indisponível(ac-s017-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                       into app-aut-cliente-message-resp
                    go                 autoriza-cliente-ex.
           move     0171codcl          to           aux-numcl.
           move     0171digcl          to           aux-digcl.
           move     zeros              to           au.
           
       autoriza-cliente-10.
           read     sce001 next with   no lock      at end
                    go                 autoriza-cliente-30.
           if       not valid-sce001
                    perform            erro-estendido
                    move "false"       to   app-aut-cliente-success-resp
                    string
                    "Serviço Indisponível(ac-sce001-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                    into    app-aut-cliente-message-resp
                    go                 autoriza-cliente-ex.
           if       sce001-categoria   not equal    99
                    go                 autoriza-cliente-10.
           
           initialize                  sce002-reg.
           move     aux-numcl          to           sce002-codcl
           start    sce002  key is     not less     key01
                    invalid            go           autoriza-cliente-10.
       autoriza-cliente-20.
           read     sce002  next with  no lock      at end
                    go                 autoriza-cliente-10.
           if       not valid-sce002
                    perform            erro-estendido
                    move "false"       to   app-aut-cliente-success-resp
                    string
                    "Serviço Indisponível(ac-sce002-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                    into    app-aut-cliente-message-resp
                    go                 autoriza-cliente-ex.
           if       sce002-codcl       not equal    aux-numcl
                    go                 autoriza-cliente-10.                                  
                    
                    
           if       sce001-sequencia   equal        1
                    move  1            to           au
              if    sce002-resp1       equal        zeros
                    move "N"          to app-aut-cliente-respo-resp(au)
              else
                    move "S"          to app-aut-cliente-respo-resp(au).            
                    
           if       sce001-sequencia   equal        2
                    move  2            to           au
              if    sce002-resp2       equal        zeros
                    move "N"          to app-aut-cliente-respo-resp(au)
              else
                    move "S"          to app-aut-cliente-respo-resp(au).            
                    
           if       sce001-sequencia   equal        3
                    move  3            to           au
              if    sce002-resp3       equal        zeros
                    move "N"          to app-aut-cliente-respo-resp(au)
              else
                    move "S"          to app-aut-cliente-respo-resp(au).            
                    
           if       sce001-sequencia   equal        4
                    move  4            to           au
              if    sce002-resp4       equal        zeros
                    move "N"          to app-aut-cliente-respo-resp(au)
              else
                    move "S"          to app-aut-cliente-respo-resp(au).            
                    
           if       sce001-sequencia   equal        5
                    move  5            to           au
              if    sce002-resp5       equal        zeros
                    move "N"          to app-aut-cliente-respo-resp(au)
              else
                    move "S"          to app-aut-cliente-respo-resp(au).            
                    
           move     function trim(sce001-pergunta)
                                      to app-aut-cliente-texto-resp(au).
           go       autoriza-cliente-10.                                                                         
       autoriza-cliente-30.             
           move     "true"             to   app-aut-cliente-success-resp
           move     "OK"               to   app-aut-cliente-message-resp         
           move     "true"             to   app-aut-cliente-token-resp.         
       autoriza-cliente-ex.  
           exit.
      *-----------------------------------------------------------------
       resposta-autoriza.
           initialize                  ws-resposta-autorizacao-resp.      
           close    s017.
           open     input              s017.
           if       not valid-s017
                    perform            erro-estendido
                    move "false"  to   app-resp-autorizacao-success-resp
                    string
                    "Serviço Indisponível(ab-s017-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                               into    app-resp-autorizacao-message-resp
                    go                 resposta-autoriza-ex.
           close    s717.
           open     input              s717.
           if       not valid-s717
                    perform            erro-estendido
                    move "false"  to   app-resp-autorizacao-success-resp
                    string
                    "Serviço Indisponível(ab-s717-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                               into    app-resp-autorizacao-message-resp
                    go                 resposta-autoriza-ex.
           move     app-resp-autorizacao-token-in  
                                       to           aux-token.
           move     aux-t3             to           7171codcl.
           read     s717  with         no lock.
           if       not valid-s717
                    initialize         7171cadas.
           if       app-resp-autorizacao-token-in  
                                       not equal    7171token
                    perform            erro-estendido
                    move "false"   to  app-resp-autorizacao-success-resp
                    string
                    "Token Inválido, Você será Desconectado."
                                       delimited by size
                                  into app-resp-autorizacao-message-resp
                    move "false"  to   app-resp-autorizacao-token-resp                                       
                    go                 resposta-autoriza-ex.
           move     "true"        to   app-resp-autorizacao-token-resp.                             

           move     7171codcl          to           0171codcl.
           read     s017   with        no lock.
           if       not valid-s017
                    perform            erro-estendido
                    move "false"  to   app-resp-autorizacao-success-resp
                    string
                    "Serviço Indisponível(ac-s017-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                  into app-resp-autorizacao-message-resp
                    go                 resposta-autoriza-ex.
           move     0171codcl          to           aux-numcl.
           move     0171digcl          to           aux-digcl.

           close    sce002.
           open     i-o                sce002.
           if       not valid-sce002
                    perform            erro-estendido
                    move "false"  to   app-resp-autorizacao-success-resp
                    string
                    "Serviço Indisponível(ab-sce002-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                               into    app-resp-autorizacao-message-resp
                    go                 resposta-autoriza-ex.
           initialize                  sce002-reg.
           move     aux-numcl          to           sce002-codcl
           start    sce002  key is     not less     key01
                    invalid            go          resposta-autoriza-ex.
       resposta-autoriza-10.
           read     sce002  next with  no lock      at end
                    go                 resposta-autoriza-20.
           if       not valid-sce002
                    perform            erro-estendido
                    move "false"       to   app-aut-cliente-success-resp
                    string
                    "Serviço Indisponível(ac-sce002-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                    into    app-aut-cliente-message-resp
                    go                 resposta-autoriza-ex.
           if       sce002-codcl       not equal    aux-numcl
                    go                 resposta-autoriza-20.
           if       app-resp-autorizacao-r1-in equal  "S"
                    move 1             to           sce002-resp1.   
           if       app-resp-autorizacao-r2-in equal  "S"
                    move 1             to           sce002-resp2.   
           if       app-resp-autorizacao-r3-in equal  "S"
                    move 1             to           sce002-resp3.   
           if       app-resp-autorizacao-r4-in equal  "S"
                    move 1             to           sce002-resp4.   
           if       app-resp-autorizacao-r5-in equal  "S"
                    move 1             to           sce002-resp5.
           if       app-resp-autorizacao-r1-in equal  "N"
                    move 0             to           sce002-resp1.   
           if       app-resp-autorizacao-r2-in equal  "N"
                    move 0             to           sce002-resp2.   
           if       app-resp-autorizacao-r3-in equal  "N"
                    move 0             to           sce002-resp3.   
           if       app-resp-autorizacao-r4-in equal  "N"
                    move 0             to           sce002-resp4.   
           if       app-resp-autorizacao-r5-in equal  "N"
                    move 0             to           sce002-resp5.
           rewrite  sce002-reg.                       
           go       resposta-autoriza-10.
       resposta-autoriza-20.
           move     "true"          to app-resp-autorizacao-success-resp
           move     "OK"            to app-resp-autorizacao-message-resp
           move     "true"          to app-resp-autorizacao-token-resp.
       resposta-autoriza-ex.
           exit.  
      *-----------------------------------------------------------------
       transacao-pix.
           initialize                  ws-transacao-pix-resp.      

           accept   banco-pix          from environment "banco_pix".
           if       banco-pix          equal        zeros
                    move 748           to           banco-pix.       
       
           string   "(pagamentos)?bank=" banco-pix
                                       into     service-name-pagamentos.
       
           initialize                  log-pix-base-url.
           accept   log-pix-base-url   from environment
                                       "url_services_pagamentos".
           if       log-pix-base-url       =            spaces
                    move "false"  to   app-tra-pix-success-resp
                    move "Não informada a url para geração do PIX."
                                       to      app-tra-pix-message-resp
                    go                 transacao-pix-ex.                                                      
       
           close    s017.
           open     input              s017.
           if       not valid-s017
                    perform            erro-estendido
                    move "false"  to   app-tra-pix-success-resp
                    string
                    "Serviço Indisponível(ab-s017-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                               into    app-tra-pix-message-resp
                    go                 transacao-pix-ex.
           close    s717.
           open     input              s717.
           if       not valid-s717
                    perform            erro-estendido
                    move "false"  to   app-tra-pix-success-resp
                    string
                    "Serviço Indisponível(ab-s717-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                               into    app-tra-pix-message-resp
                    go                 transacao-pix-ex.
           move     app-tra-pix-token-in  
                                       to           aux-token.
           move     aux-t3             to           7171codcl.
           read     s717  with         no lock.
           if       not valid-s717
                    initialize         7171cadas.
           if       app-tra-pix-token-in  
                                       not equal    7171token
                    perform            erro-estendido
                    move "false"   to  app-tra-pix-success-resp
                    string
                    "Token Inválido, Você será Desconectado."
                                       delimited by size
                                  into app-tra-pix-message-resp
                    move "false"  to   app-tra-pix-token-resp                                       
                    go                 transacao-pix-ex.
           move     "true"        to   app-tra-pix-token-resp.                             

           move     7171codcl          to           0171codcl.
           read     s017   with        no lock.
           if       not valid-s017
                    perform            erro-estendido
                    move "false"  to   app-tra-pix-success-resp
                    string
                    "Serviço Indisponível(ac-s017-"
                                       delimited by size
                    extend-stat        delimited by spaces
                    ")"                delimited by size
                                  into app-tra-pix-message-resp
                    go                 transacao-pix-ex.
           initialize                  aux-doc.         
           if       0171fisju          =            "F"
                    move 0175cgcpf     to           aux-doc
                    set doc            to          JString:>new(aux-doc)
                    set doc            to       doc:>replaceAll("-", "")
                    set pix-sol-dev-cpf to         doc 
           else
                    move 0175cgcpf     to           aux-doc
                    set doc            to          JString:>new(aux-doc)
                    set doc            to       doc:>replaceAll("-", "")
                    set doc            to       doc:>replaceAll("/", "")
                    set pix-sol-dev-cnpj to         doc                   
           end-if.
           move     $trim(0172nomcl)   to           pix-sol-dev-nome
           move     app-tra-pix-tempo-in  to     pix-sol-cal-calendario.
           move     app-tra-pix-valor-in  to        ed-valor.
           move     ed-valor           to           wk-valor.
           move     "."                to           wk-v2.
           move     $trim(wk-valor)    to           pix-sol-v-original.
           move     0                  to           
                                       pix-sol-v-modalidadeAlteracao.
           copy     "httpDoPostExServico"     replacing 
                    ==(prefix)==       by log-pix
                    ==(body)==         by pix-solicitacao-body
                    ==(resp)==         by pix-solicitacao-response
                    ==(boolean-r)==    by pix-sol-success-r
                    ==(message-r)==    by pix-sol-message-r
                    ==(dtMessage-r)==  by pix-sol-dtMessage-r
                    ==(endPointName)== by "(PAG_PIX_SOLICITACAO)".
           if       not pix-sol-success-r
                    move "false"  to   app-tra-pix-success-resp
                    move pix-sol-message-r
                                       to app-tra-pix-message-resp                    
                    go                 transacao-pix-ex.
                    
           move     pix-sol-pixCopiaECola-r
                                       to   app-tra-pix-copiacola-resp. 
           move     pix-sol-txid-r     to   app-tra-txid-resp. 
           move     aux-banco          to   app-tra-banco-resp.                                                                
                    
           move     "true"          to app-tra-pix-success-resp
           move     "OK"            to app-tra-pix-message-resp
           move     "true"          to app-tra-pix-token-resp.
       
       transacao-pix-ex.
           exit.
           
      *-----------------------------------------------------------------
       ler-s104.
           initialize                  listapdv-cashback-resp
                                       1041cadas     
                                       idx.
           close    sig092.
           open     i-o sig092.
           if not   valid-sig092
                    move "false"       to          app-cash-success-resp
                    perform            erro-estendido
                    string
                    "Erro ao abrir tabela sig092 (ac-sig092-"
                    extend-stat")"     into        app-cash-message-resp
                    end-string
                    exit               paragraph
           end-if.
           
           initialize                  aux-select.
           perform  abre-conexao-sql.
           if       continuar-nao
                    set app-pdv-success-resp    to           false
                    string "Erro ao conectar no banco de dados. Contate"
                    " a TI."           into         app-pdv-message-resp
                    exit               paragraph
           end-if.
           
           string   "select " 
                    '"1043anoem", "1043mesem", "1042numpe", '
                    '"1041filia", "1045datem", "1041total", ' 
                    '"1041codcl" from '
                    'a_pdv104 where "1044numnf" = 0 and "1042codcl" ='  
                     reads104-codcl'  and '
                    '"1043anoem"='reads104-anochave' and "1043mesem"= '
                      reads104-meschave  into         aux-select
           end-string.                            
           exec sql
                    prepare selecao    from         :aux-select 
           end-exec         
           if       continuar-nao
                    set app-pdv-success-resp    to           false
                    move "Erro ao buscar notificacoes"
                                       to           app-pdv-message-resp
                    exit               paragraph
           end-if.
           exec sql 
                    declare pedidos     cursor for selecao
           end-exec  
           if       continuar-nao
                    set app-pdv-success-resp    to           false
                    move "Erro ao buscar notificacoes"
                                       to           app-pdv-message-resp
                    exit               paragraph
           end-if.
           exec sql 
                    open pedidos
           end-exec 
           if       continuar-nao
                    set app-pdv-success-resp    to           false
                    move "Erro ao processar notificacoes."
                                       to           app-pdv-message-resp
                    exit               paragraph
           end-if.
           initialize                  idx.
           perform until exit
              exec sql
                   fetch next pedidos into
                    :aux1043anoem,
                    :aux1043mesem,
                    :aux1042numpe, 
                    :aux1041filia, 
                    :aux1045datem, 
                    :aux1041total, 
                    :aux1041codcl, 
              end-exec  
              if continuar-nao
                 move "Erro ao processar notificacoes"
                                       to           app-pdv-message-resp
                 exit                  perform
              end-if
              if sqlcode               <>           0
                 if sqlcode            <>           100           
                    set app-pdv-success-resp    to           false
                    move "Ocorreu um erro ao processar notificacoes"
                                       to           app-pdv-message-resp
                 end-if
                 exit                  perform
              end-if
              add  1                   to           idx
              initialize sig092-reg
              move aux1045datem        to           aux-data                       
              move aux-dia             to           inv-dia
              move aux-mes             to           inv-mes
              move aux-ano             to           inv-ano
              move inv-data            to           sig092-datped
              move aux1041filia        to           sig092-filped
              move aux1042numpe        to           sig092-numped
              move aux1041codcl        to           sig092-codcli
              perform sig092-read-inex-ok
              if    acesso-ok
                    move 1             to    app-pdv-pixgerado-resp(idx)
              else
                    move 0             to    app-pdv-pixgerado-resp(idx)
              end-if
              move aux1043anoem        to    app-pdv-anochave-resp(idx)     
              move aux1043mesem        to    app-pdv-meschave-resp(idx)       
              move aux1042numpe        to    app-pdv-numpedido-resp(idx)                             
              move aux1041filia        to    app-pdv-filial-resp(idx)                             
              move inv-data            to    app-pdv-dtpedido-resp(idx)                          
              
              
              move aux1041total        to    app-pdv-total-resp(idx)
           end-perform.
           exec sql 
                    close pedidos
           end-exec
           if       continuar-nao
                    set app-pdv-success-resp    to           false
                    move "Erro ao fechar lista de notificacoes."
                                       to           app-pdv-message-resp
                    exit               paragraph
           end-if.
           exec sql 
                    disconnect all      
           end-exec.
      *-----------------------------------------------------------------
       consulta-cashback.
           set      exibir-msg-nao     to           true.
           perform  aux076-clear.
           if       acesso-erro
                    move "false"       to          app-cash-success-resp
                    perform            erro-estendido
                    string
                    "Erro ao abrir tabela aux076 (ac-aux076-"
                    extend-stat")"     into        app-cash-message-resp
                    end-string
                    exit               paragraph
           end-if.
           close    sig076.
           open     i-o sig076.
           if not   valid-sig076
                    move "false"       to          app-cash-success-resp
                    perform            erro-estendido
                    string
                    "Erro ao abrir tabela sig076 (ac-sig076-"
                    extend-stat")"     into        app-cash-message-resp
                    end-string
                    exit               paragraph
           end-if.
           close    sig092.
           open     i-o sig092.
           if not   valid-sig092
                    move "false"       to          app-cash-success-resp
                    perform            erro-estendido
                    string
                    "Erro ao abrir tabela sig092 (ac-sig092-"
                    extend-stat")"     into        app-cash-message-resp
                    end-string
                    exit               paragraph
           end-if.
           initialize                  idx
                                       sig076-reg
                                       aux-cash-debtotal
                                       aux-cash-credtotal
                                       ws-consulta-cashback-resp.
                                       
           move     app-cash-codcli-in to           sig076-codcli
           move     00010101           to           sig076-datem
           
           start    sig076 key is      >=           chave3.
           perform until exit
              perform  sig076-read-next
              if    acesso-fim
              or    sig076-codcli      <>          app-cash-codcli-in
                    exit perform
              end-if
              if    sig076-debcr       =            "D"
                    add sig076-valor   to           aux-cash-debtotal
              else
                    add sig076-valor   to           aux-cash-credtotal
              end-if
           end-perform.
           
           perform  captura-data-hora.
           
           initialize sig092-reg.
           move     app-cash-codcli-in to           sig092-codcli
           start    sig092 key is      >=           chave3.
           perform until exit
              perform  sig092-read-next
              if    acesso-fim
              or    sig092-codcli      <>          app-cash-codcli-in
                    exit perform
              end-if
              compute calc-date        =            inv-data
                                       -            sig092-datped
              end-compute
              if    calc-date          <=           3
              and   sig092-105numnf    =            zeros
                    add sig092-vlrcash to           aux-cash-debtotal
              end-if
      *        if    calc-date          >=           10
      *        and   sig092-105numnf    =            zeros
      *              set exibir-msg-nao to           true
      *              perform sig092-delete
      *        end-if
           end-perform.
      *     
           compute  app-cash-credtotal-resp =       aux-cash-credtotal
                                            -       aux-cash-debtotal
           end-compute.
           
           move     17.00              to          app-cash-porcent-resp
           
           
           initialize                  sig076-reg.
           move     app-cash-codcli-in to           sig076-codcli
           move     app-cash-datini-in to           sig076-datem
           
           start    sig076 key is      >=           chave3.
           perform until exit
              perform  sig076-read-next
              if    acesso-fim
              or    sig076-codcli      <>           app-cash-codcli-in
              or    sig076-datem       >            app-cash-datfin-in
                    exit perform
              end-if
              move  sig076-orige       to           aux076-orige
              move  sig076-numnf       to           aux076-numnf
              move  sig076-serie       to           aux076-serie
              move  sig076-debcr       to           aux076-debcr
              set   exibir-msg-nao     to           true
              perform  aux076-read
              if    acesso-erro
                    move sig076-valor  to           aux076-valor
                    perform aux076-write
              else
                    add sig076-valor   to           aux076-valor
                    perform aux076-write-rewrite
              end-if
           end-perform.
     
           initialize                  aux076-reg
                                       aux-numnf.
           start    aux076 key is      >=           aux076-chave.
           perform until exit
              perform  aux076-read-next
              if    acesso-fim
                    exit perform
              end-if
              add   1                  to           idx
              move  aux076-debcr       to       app-cash-debcr-resp(idx)
              move  aux076-orige       to       app-cash-orige-resp(idx)
              move  aux076-serie       to       app-cash-serie-resp(idx)
              move  aux076-valor       to       app-cash-valor-resp(idx)
              move  aux076-numnf       to       aux-numnf
                                                app-cash-numnf-resp(idx)
           end-perform.
    
           perform  aux076-clear-and-delete.
    

      *-----------------------------------------------------------------
       consulta-nf-cashback.
           close    sig076.
           open     i-o sig076.
           if not   valid-sig076
                    move "false"       to          app-cash-success-resp
                    perform            erro-estendido
                    string
                    "Erro ao abrir tabela sig076 (ac-sig076-"
                    extend-stat")"     into        app-cash-message-resp
                    end-string
                    exit               paragraph
           end-if.
           close    s018.
           open     i-o s018.
           if not   valid-s018
                    move "false"       to          app-cash-success-resp
                    perform            erro-estendido
                    string
                    "Erro ao abrir tabela s018 (ac-s018-"
                    extend-stat")"     into        app-cash-message-resp
                    end-string
                    exit               paragraph
           end-if.
           initialize                  idx
                                       0181cadas
                                       sig076-reg
                                       ws-consulta-nf-cashback-resp.
           move     app-nf-cash-orige-in to         sig076-orige
           move     app-nf-cash-serie-in to         sig076-serie
           move     app-nf-cash-numnf-in to         sig076-numnf
           
           start    sig076 key is      >=           sig076-chave.
           perform until exit
              perform  sig076-read-next
              if    acesso-fim
                    exit perform
              end-if
              if    sig076-numnf       <>           app-nf-cash-numnf-in
              or    sig076-orige       <>           app-nf-cash-orige-in
                    exit perform cycle
              end-if
              if    sig076-debcr       =            "D"
                    exit perform cycle
              end-if
              add   1                  to           idx
              move  sig076-itens       to   app-nf-cash-item-resp(idx)
              perform ler-item
              move  0182descr          to   app-nf-cash-desite-resp(idx)
              move  sig076-valor       to   app-nf-cash-valor-resp(idx)
           end-perform.
           
      *-----------------------------------------------------------------
       ler-item.
           initialize                  0181cadas.
           move     01                 to           0181depto.
           move     sig076-itens       to           0181itens.
           perform  s018-read-inex-ok.
      
      *-----------------------------------------------------------------
       grava-cashback.
           close    sig092.
           open     i-o sig092.
           if not   valid-sig092
                    move "false"       to          app-back-success-resp
                    perform            erro-estendido
                    string
                    "Erro ao abrir tabela sig092 (ac-sig092-"
                    extend-stat")"     into        app-back-message-resp
                    end-string
                    exit               paragraph
           end-if.
           initialize                  sig092-reg
                                       ws-grava-cashback-resp.
           move     app-back-datped-in   to         sig092-datped
           move     app-back-filped-in   to         sig092-filped
           move     app-back-numped-in   to         sig092-numped
           move     app-back-codcli-in   to         sig092-codcli
           move     app-back-vlrcash-in  to         sig092-vlrcash
           perform  sig092-write-rewrite.
           if       acesso-erro
                    move "false"       to          app-back-success-resp
                    string
                    "Serviço Indisponível(ac-sig092-" extend-stat " )" 
                                       into        app-back-message-resp
                    end-string
                    exit paragraph
           end-if.
           
           move     "true"             to         app-back-success-resp.
           move     "OK"               to         app-back-message-resp.
           
      *-----------------------------------------------------------------
       fechar-arquivos.
           close    s003
           close    s003a
           close    s017
           close    s017e.
           close    s018.
           close    s078.
           close    s078p.
           close    s084.
           close    s104.
           close    s105.
           close    s106.
           close    s107.
           close    s207.
           close    s207a.
           close    s207h.
           close    s257.
           close    s359.
           close    s405.
           close    s666.
           close    s717.
           close    s806.
           close    s816.
           close    loj001.
           close    sce001.
           close    sce002.
           close    sce003.
           close    sce004.
           close    sce005.
           close    sce012.
           close    sce014.
           close    sig076.
           close    sig076e.
           close    sig092.
           close    sig092e.
           call     "DCI_DISCONNECT"   using        ext-banco-principal.

      *
       monta-dtMessage.
           initialize                  gnr-dtMessage.
           call     "C$RERR"           using        extend-stat
                                                    text-message.
           call     "C$RERRNAME"       using        is-msg-2.
           unstring is-msg-2 delimited by "servicecomercial"
                                       into         is-msg-2
                                                    is-msg-3
           end-unstring.
           inspect  is-msg-3           replacing all "\" by " "
                                                     "/" by " "
                                                     "." by " ".
           string   "Tabela: "         delimited by size
                    $trim(is-msg-3)    delimited by trailing spaces
                    " Erro: "          delimited by size
                    extend-stat        delimited by trailing spaces
                    "-"                delimited by size
                    text-message       delimited by trailing spaces
                                       into         gnr-dtMessage
           end-string.


       copy "s017.prc".
       copy "s017e.prc".
       copy "s018.prc".
       copy "sig076.prc".
       copy "sig076e.prc".
       copy "sig092.prc".
       copy "sig092e.prc".
       copy "rotinasProg".
       copy "rotinasSql".
      *-----------------------------------------------------------------
       copy "arqaux-prc" replacing     ==(arquivo)==  by aux076
                                       ==(nome)==     by "t-aux076"
                                       ==(reg)==      by aux076-reg.
       
       copy "httpAbreSessaoServico"    replacing
                    ==(prefix)==       by log-pix
                    ==(serviceName)==  by service-name-pagamentos.
                    
                    
                    
       verifica-versao-erro.
           if       app-ver-senha-device-in not equal spaces
                    perform            atualiza-device.

           if       sce002-sisop       equal        "iOS"
           and      aux-ver-ios        not equal    aux-versao    
                    string 
                    "CRIAMOS UMA NOVA VERSÃO DO APP LOJA SOLAR."
                                       delimited by size
                   "DESINSTALE a versão que você possui em seu Celular."
                                       delimited by size
               "Acesse a sua Loja de Aplicativos e baixe a Nova Versão."
                                       DELIMITED BY SIZE
               "versão do seu aplicati - " aux-versao
                                       DELIMITED BY SIZE
                                       into app-ver-senha-message-resp
                     move "false"      to   app-ver-senha-success-resp
                    exit               paragraph
           else
           if       aux-ver-android    not equal    aux-versao    
                    string 
                    "CRIAMOS UMA NOVA VERSÃO DO APP LOJA SOLAR."
                                       delimited by size
                   "DESINSTALE a versão que você possui em seu Celular."
                                       delimited by size
               "Acesse a sua Loja de Aplicativos e baixe a Nova Versão."
                                       DELIMITED BY SIZE
               "Versão do seu aplicativo - " aux-versao
                                       DELIMITED BY SIZE
                                       into app-ver-senha-message-resp
                     move "false"      to   app-ver-senha-success-resp
                    exit               paragraph.
                    
