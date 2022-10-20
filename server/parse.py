class Parse:
    
    def instant(data):
        computed = []
        for instant in data:
            ins = {
                'username' : instant["userName"],
                'avatar' : instant['user']['profilePicture']['url'] if 'profilePicture' in instant['user'] else '',
                'primary' : instant['photoURL'],
                'secondary' : instant['secondaryPhotoURL'],
                'caption' : instant['caption'] if 'caption' in instant else '',
                'location' : instant['location']
            }
            computed.append(ins)
        return computed