# Subir ADB no WSL (USB passthrough via usbipd)

Comandos para conectar o celular Android (USB) ao WSL usando `usbipd-win`.

## 1. No Windows (PowerShell como Administrador)

Listar dispositivos USB e identificar o `BUSID` do celular:

```powershell
usbipd list
```

Compartilhar (bind) o dispositivo — só precisa rodar uma vez por dispositivo/porta:

```powershell
usbipd bind --busid <BUSID>
```

Anexar (attach) o dispositivo ao WSL — precisa rodar toda vez que reiniciar a máquina ou desconectar o cabo:

```powershell
usbipd attach --wsl --busid <BUSID>
```

## 2. No WSL

Conferir se o dispositivo apareceu e o adb está enxergando:

```bash
adb devices
```

Se não aparecer, reiniciar o servidor adb dentro do WSL:

```bash
adb kill-server
adb start-server
adb devices
```

## Observações

- O `BUSID` pode mudar entre reinicializações ou trocas de porta USB — sempre conferir com `usbipd list` antes.
- Após reiniciar a máquina Windows, é necessário rodar `usbipd attach` novamente (o `bind` costuma persistir, mas o `attach` não).
- Se o dispositivo estava anexado ao Windows e some do `adb devices` no Windows, é porque ele foi passado para o WSL — use `usbipd detach --busid <BUSID>` no Windows para devolver.

usbipd list
usbipd attach --wsl --busid <BUSID>
