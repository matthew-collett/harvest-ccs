.PHONY: hapi-setup hapi-start app-setup app-start setup

PYTHON = python3.12

ifeq ($(OS),Windows_NT)
	VENV_PYTHON = hapi\venv\Scripts\python.exe
	VENV_PIP = hapi\venv\Scripts\pip.exe
	ACTIVATE = call hapi\venv\Scripts\activate.bat
	CHAIN = &
else
	VENV_PYTHON = hapi/venv/bin/python
	VENV_PIP = hapi/venv/bin/pip
	ACTIVATE = . hapi/venv/bin/activate
	CHAIN = &&
endif

# hapi settings
HOST = localhost
PORT = 5000

# app settings
APP_DIR = app

# hapi targets
hapi-setup:
	$(PYTHON) -m venv hapi/venv
	$(ACTIVATE) $(CHAIN) $(VENV_PIP) install -r hapi/requirements.txt

hapi-start:
	$(ACTIVATE) $(CHAIN) $(VENV_PYTHON) hapi/run.py --host=$(HOST) --port=$(PORT)

# app targets
app-setup:
	cd $(APP_DIR) $(CHAIN) yarn

app-start:
	cd $(APP_DIR) $(CHAIN) yarn run dev

# both
setup: hapi-setup app-setup