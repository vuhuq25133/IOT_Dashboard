# 1. FE Setup
``` py
cd frontend

# install Tailwind & Shadcn
npm install tailwindcss @tailwindcss/vite
npm install -D @types/node

npm run dev

npx shadcn@latest init
npx shadcn@latest add button
```

# 2. BE Setup
```py
cd backend
npm init -y
npm i express mongoose dotenv cors socket.io mqtt
npm i -D nodemon    # không phải require...

node .\src\index.js

```

# 3. MongoDB Setup
## 1. lib/db.js
## 2. models
## 3. controllers


# 4. FE
```npm i axios react-router-dom recharts
npm install chart.js

npm install --save-dev @types/chart.js
npm install react-icons
```

# 5. cmd
```
cd ..
cd .. 
cd mosquitto
// trỏ về thư mục chứa folder mosquitto
mosquitto -v -c mosquitto.conf

mosquitto_pub -h 172.20.10.7 -p 1883 -u iotuser -P iotpass -t "iot/fan" -m "on"
mosquitto_pub -h 172.20.10.7 -p 1883 -u iotuser -P iotpass -t "iot/air" -m "on"
mosquitto_pub -h 172.20.10.7 -p 1883 -u iotuser -P iotpass -t "iot/lamp" -m "on"
```
