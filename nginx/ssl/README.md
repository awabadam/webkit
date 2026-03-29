Place your SSL certificates here:

- `fullchain.pem` — Full certificate chain
- `privkey.pem` — Private key

For Let's Encrypt, use certbot:
```
certbot certonly --standalone -d your-domain.com
```

Then copy the certificates:
```
cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ./nginx/ssl/
cp /etc/letsencrypt/live/your-domain.com/privkey.pem ./nginx/ssl/
```
