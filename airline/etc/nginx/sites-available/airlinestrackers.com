upstream app_airlinestrackers {
     server 127.0.0.1:8080;
   }
   
   server {
     listen 0.0.0.0:80;
     server_name www.airlinestrackers.com airlinestrackers.com;
     access_log  /var/log/nginx/airlinestrackers.com.access.log;
     root   /var/www/airlinestrackers;
 
     location / {
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Host $http_host;
      proxy_set_header X-NginX-Proxy true;
  
      proxy_pass http://app_airlinestrackers/;
      proxy_redirect off;
  
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
    }
}
