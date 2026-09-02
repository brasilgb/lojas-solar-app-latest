# Subir ADB via Wi-Fi (sem USB passthrough)

Evita o problema do WSL perder o dispositivo USB (`usbipd`). Depois de conectado uma vez, o adb enxerga o celular pela rede — não precisa mais de cabo nem do `usbipd attach`.

## Opção A — Android 11+ (pareamento sem fio, sem nunca plugar o cabo)

No celular: **Ajustes > Opções do desenvolvedor > Depuração sem fio**.

```bash
# Toque em "Parear dispositivo com código QR" ou "código de pareamento"
adb pair <IP>:<PORTA_PAREAMENTO>
# digite o código de 6 dígitos quando pedir

adb connect <IP>:<PORTA_CONEXAO>   # porta mostrada na tela principal de "Depuração sem fio"
adb devices
```

## Opção B — Qualquer versão (precisa do cabo uma única vez)

1. Conecte o celular por USB (via `usbipd attach`, só dessa vez).
2. No WSL:

```bash
adb devices                 # confirma que apareceu por USB
adb tcpip 5555              # coloca o adbd em modo TCP na porta 5555
adb shell ip route          # pega o IP do celular na rede (campo "src")
```

3. Desconecte o cabo (pode até devolver o dispositivo pro Windows com `usbipd detach`).
4. Conecte pela rede:

```bash
adb connect <IP_DO_CELULAR>:5555
adb devices
```

## Reconectar depois (dia a dia)

O celular pode trocar de IP (DHCP) e a porta 5555 fecha se o adbd reiniciar. Se `adb devices` mostrar `offline` ou não listar nada:

```bash
adb connect <IP_DO_CELULAR>:5555
```

Se não conectar, o adbd voltou pro modo USB — repita a Opção B (precisa do cabo de novo, mas só um instante).

## Observações

- Celular e PC/WSL precisam estar na **mesma rede Wi-Fi**.
- O WSL2 usa uma sub-rede virtual (NAT), mas como o IP de destino é o do celular na rede real, a conexão funciona normalmente — o WSL só precisa enxergar a rede do host (padrão).
- Se o roteador usa "isolamento de cliente" (comum em redes de convidado), o adb via Wi-Fi não funciona — use a Opção B só quando precisar, ou desative o isolamento.
- Para automatizar, dá pra salvar o IP fixo do celular (IP reservado no roteador) e criar um alias `alias adbw='adb connect 192.168.x.x:5555'`.
