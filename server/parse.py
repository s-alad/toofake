import os
from dotenv import load_dotenv
from geopy.geocoders import GoogleV3
from humanfriendly import format_timespan

class Parse:
    load_dotenv()
    
    @staticmethod
    def location(loc):
        gapi = os.getenv('GAPI')
        geolocator = GoogleV3(api_key=gapi)
        location = geolocator.reverse("{}, {}".format(loc['_latitude'], loc['_longitude']), exactly_one=False)
        loose = str(location[-6]).split(',')
        return loose[1] +', ' + loose[0]
    
    @staticmethod
    def time(t):
        if t == 0: return 'on time'
        return format_timespan(t).replace('hour','hr').replace('seconds','s').replace('minutes','min').split('and')[0] +' late'

    @staticmethod
    def instant(data):
        computed = []
        for instant in data:
            ins = {
                'username' : instant["userName"],
                'avatar' : instant['user']['profilePicture']['url'] if 'profilePicture' in instant['user'] else '',
                'primary' : instant['photoURL'],
                'secondary' : instant['secondaryPhotoURL'],
                'caption' : instant['caption'] if 'caption' in instant else '',
                'location' : Parse.location(instant['location']) if 'location' in instant else '',
                'retakes' : instant['retakeCounter'],
                'late' : Parse.time(instant['lateInSeconds'])
            }
            computed.append(ins)
        return computed