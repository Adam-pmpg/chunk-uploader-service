#!/bin/bash

# Tworzenie katalogów, jeśli nie istnieją
mkdir -p /app/chunks /app/output

# Sprawdzamy, czy mamy uprawnienia do zmiany właściciela
if [ "$(id -u)" -eq 0 ]; then
  # Ustawiamy właściciela na użytkownika 'node'
  chown -R node:node /app/chunks /app/output
fi

# Uruchamiamy aplikację jako 'node'
exec su-exec node "$@"

