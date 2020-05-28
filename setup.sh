#!/usr/bin/env bash

find /home/node/risk-assignment-site/dist  -type f -print0 | xargs -0 sed -i "s/RISK_TEAM/$TEAM/g"
find /home/node/risk-assignment-site/dist  -type f -print0 | xargs -0 sed -i "s/#000001/$PRIMARY_COLOR/g"
find /home/node/risk-assignment-site/dist  -type f -print0 | xargs -0 sed -i "s/#FFFFFE/$SECONDARY_COLOR/g"
find /home/node/risk-assignment-site/dist  -type f -print0 | xargs -0 sed -i "s/#fffffe/$SECONDARY_COLOR/g"

exec "$@"