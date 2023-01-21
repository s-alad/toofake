git clone https://github.com/s-alad/toofake.git
cd toofake
pip install -r ./server/requirements.txt
python ./server/api.py &
cd client
npm install
npm start