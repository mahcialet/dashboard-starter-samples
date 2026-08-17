#!/bin/sh
set -eu

marker=/etc/linkding/data/.dashboard-sample-seeded

if [ -e "$marker" ]; then
  echo "linkding sample bookmarks already seeded"
  exit 0
fi

python manage.py import_netscape /seed/bookmarks.html "${LD_SUPERUSER_NAME:-admin}"
touch "$marker"
echo "linkding sample bookmarks seeded"
