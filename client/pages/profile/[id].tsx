import axios from 'axios';
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import s from './profile.module.scss'

interface Friend {
    id: string;
    username: string;
    fullname: string;
    profilePicture: {
        url: string | null; // Allow null values
        width: number;
        height: number;
    } | null; // Allow null values
}

export default function Profile() {
    const router = useRouter()

    const [username, setUsername] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [bio, setBio] = useState<string>("");
    const [pfp, setPfp] = useState<string>("");
    const [joinDate, setJoined] = useState<string>("");
    const [location, setLocation] = useState<string>("");
    const [status, setStatus] = useState<string>("");
	const [streak, setStreak] = useState<string>("");
    const [friendedDate, setFriendedDate] = useState<string>("");
    const [mutualFriends, setMutualFriends] = useState<Friend[]>([]);
    const [mutualFriendsLoading, setMutualFriendsLoading] = useState<boolean>(true);

    useEffect(() => {

        if (!router.isReady) return;

        const fetchProfileData = async () => {
            try {
                const rid = router.query.id;
                const token = localStorage.getItem("token");
                const body = JSON.stringify({ "token": token, "profile_id": rid });
                const options = {
                    url: "/api/profile",
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    data: body,
                };

                const response = await axios.request(options);
                const data = response.data;
				
				console.log(data);

                setUsername(data.username);
                setName(data.fullname);
                setBio(data.biography ?? "");
                setLocation(data.location ?? "");
				setStreak(data.streakLength ?? "");
                setPfp(data.profilePicture?.url ?? "");
                setJoined(new Date(data.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) + ', ' + new Date(data.createdAt).toLocaleTimeString());
                setStatus(data.relationship.status);
                setFriendedDate(data.relationship.friendedAt ? new Date(data.relationship.friendedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) + ', ' + new Date(data.relationship.friendedAt).toLocaleTimeString() : "");

                // Populate mutual friends
                setMutualFriends(data.relationship.commonFriends.sample);
                setMutualFriendsLoading(false);

            } catch (error) {
                console.error(error);
            }
        };

        fetchProfileData();
    }, [router.isReady]);

    const handleFriendClick = (friendId: string) => {
        window.location.replace(`/profile/${friendId}`);
    };

    return (
        <div className={s.me}>
            <div className={s.card}>
                {pfp ? <img src={pfp} className={s.pfp} /> : <div className={s.pfp}>no profile picture</div>}
                <div className={s.details}>
                    <div className={s.detail}>
                        <div className={s.label}>username</div>
                        <div className={s.value}>{username}</div>
                    </div>
                    <div className={s.detail}>
                        <div className={s.label}>name</div>
                        <div className={s.value}>{name}</div>
                    </div>
                    {bio.length > 0 && (
                        <div className={s.detail}>
                            <div className={s.label}>biography</div>
                            <div className={s.value}>{bio}</div>
                        </div>
                    )}
                    {location.length > 0 && (
                        <div className={s.detail}>
                            <div className={s.label}>location</div>
                            <div className={s.value}>{location}</div>
                        </div>
                    )}
                    <div className={s.detail}>
                        <div className={s.label}>date Joined</div>
                        <div className={s.value}>{joinDate}</div>
                    </div>
                    <div className={s.detail}>
                        <div className={s.label}>relation</div>
                        <div className={s.value}>{status === "accepted" ? "friends" : "stranger"}</div>
                    </div>
					
					
                    {friendedDate.length > 0 && (
                        <div className={s.detail}>
                            <div className={s.label}>date Friended</div>
                            <div className={s.value}>{friendedDate}</div>
                        </div>
                    )}
					 <div className={s.detail}>
                        <div className={s.label}>current streak</div>
                        <div className={s.value}>🔥 {streak} 🔥</div>
                    </div>
                </div>
				
            </div>
            <div className={s.divider}></div>
            <div className={s.friends}>
                <div className={s.title}>Mutual Friends ({mutualFriends.length})</div>
                {mutualFriendsLoading ? (
                    <div className={s.loader}></div>
                ) : (
                    mutualFriends.map((friend) => (
                        <div
                            key={friend.id}
                            className={s.friend}
                            onClick={() => handleFriendClick(friend.id)}
                            role="button"
                            tabIndex={0}
                        >
                            {friend.profilePicture && friend.profilePicture.url ? (
                                <img src={friend.profilePicture.url} className={s.pfp} />
                            ) : (
                                <div className={s.pfp}>no profile picture</div>
                            )}
                            <div className={s.details}>
                                <div className={s.username}>@{friend.username}</div>
                                <div className={s.fullname}>{friend.fullname}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
