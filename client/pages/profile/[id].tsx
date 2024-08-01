import axios from 'axios';
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import s from './profile.module.scss'

interface ProfileData {
    username: string;
    name: string;
    bio: string;
    pfp: string;
    status: string;
}

export default function Profile(){
    const router = useRouter()

    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!router.isReady) return;

            try {
                const rid = router.query.id;
                const token = localStorage.getItem("token");

                const response = await axios.post("/api/profile", {
                    token,
                    profile_id: rid,
                }, {
                    headers: { 'Content-Type': 'application/json' }
                });

                const data = response.data;

                setProfile({
                    username: data.username,
                    name: data.fullname,
                    bio: data.biography || "",
                    pfp: data.profilePicture?.url || "",
                    status: data.relationship.status,
                });
            } catch (error) {
                console.error(error);
                setError("An error occurred while fetching the profile.");
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();

    }, [router.isReady]);

    if (loading) return <div>Loading...</div>;

    if (error) return <div className={s.error}>{error}</div>;

    if (!profile) return <div className={s.error}>Profile not found.</div>;

    return (
        <div className={s.me}>
            <div className={s.card}>
                {profile.pfp ? (
                    <img src={profile.pfp} alt="Profile picture" className={s.pfp}/>
                ) : (
                    <div className={s.pfp}>No profile picture</div>
                )}
                <div className={s.details}>
                    <ProfileDetail label="Username" value={profile.username}/>
                    <ProfileDetail label="Name" value={profile.name}/>
                    {profile.bio && <ProfileDetail label="Biography" value={profile.bio}/>}
                    <ProfileDetail label="Relation" value={profile.status === "accepted" ? "Friends" : "Stranger"}/>
                </div>
            </div>
        </div>
    );
}

interface ProfileDetailProps {
    label: string;
    value: string;
}

const ProfileDetail = ({ label, value }: ProfileDetailProps) => (
    <div className={s.detail}>
        <div className={s.label}>{label}</div>
        <div className={s.value}>{value}</div>
    </div>
);
