#!/bin/bash
url_encode() {
   awk 'BEGIN {
      for (n = 0; n < 125; n++) {
         m[sprintf("%c", n)] = n
      }
      n = 1
      while (1) {
         s = substr(ARGV[1], n, 1)
         if (s == "") {
            break
         }
         t = s ~ /[[:alnum:]_.!~*\47()-]/ ? t s : t sprintf("%%%02X", m[s])
         n++
      }
      print t
   }' "$1"
}

username='user.name'
passwd=$(url_encode $ERP_PASS)

magic=$(wget --no-check-certificate -qO- "https://agnigarh.iitg.ac.in:1442/login?" | sed -n 's/.*name="magic" value="\([^"]*\)".*/\1/p')
# magic=$(wget --no-check-certificate -qO- "https://192.168.193.1:1442/login?" | sed -n 's/.*name="magic" value="\([^"]*\)".*/\1/p')

lk=$(curl --data "4Tredir=https%3A%2F%2Fagnigarh.iitg.ac.in%3A1442%2Flogin%3F&magic=$magic&username=$username&password=$passwd" https://agnigarh.iitg.ac.in:1442/ --insecure)
# lk=$(curl --data "4Tredir=https%3A%2F%2F192.168.193.1%3A1442%2Flogin%3F&magic=$magic&username=$username&password=$passwd" https://192.168.193.1:1442/ --insecure)

mu=${lk:59:59}
#use mu=${lk:72:59}, if 1200sec is not the default reload option 

if [[ "$mu" == *"keepalive"* ]]; then
  echo Signed in successfully
else
    echo Authentication Failed
    echo Magic - $magic
fi

# while true
# do
#     sleep 15
#     curl -k -b cookiejar.txt "$mu"
#     echo Signed in successfully
# done
