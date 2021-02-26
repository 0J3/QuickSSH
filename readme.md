# QuickSSH

Quickly connect to SSH without bothering to wait for a terminal like terminus to open, or to type a command in manually if you're really lazy and don't use something like terminus

---

## Installation

Clone this directory, and open it in a CMD. Then run `yarn` in the directory\*

\* `npm install` also works, but usage of [yarn](https://yarnpkg.com) is HEAVILY reccomended

## Usage

Open into `linux` or `windows` (depending on your OS) in a file manager or a command prompt.

### Adding a host

Run `add.sh` / `add.bat` and follow the instructions.

### Removing a host

SoonTM (or remove entries from list.yml)

### Connecting to a host

run `connect.sh` / `connect.bat` and select a host.

### Setting a Label

1. Edit list.yml in any text editor.
2. Find the host under the `data` key.
3. Edit said label to whatever you want.
4. Save.

## Why did I make this?

because someone keeps asking me to do shit on their vps and i cba to wait for [terminus](https://www.electronjs.org/apps/terminus) (the cmd i primarily use) to open every time.
