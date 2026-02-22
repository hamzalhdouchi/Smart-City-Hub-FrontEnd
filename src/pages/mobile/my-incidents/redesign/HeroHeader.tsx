import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Zap } from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import { userService } from '../../../../services/userService';

export const HeroHeader: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        const fetchPhoto = async () => {
            try {
                const url = await userService.getMyProfilePhoto();
                if (url) {
                    setPhotoUrl(url);
                    setImgError(false);
                }
            } catch (error) {
                console.error('Failed to fetch photo', error);
                setImgError(true);
            }
        };
        fetchPhoto();
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const initials = user?.firstName && user?.lastName
        ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
        : 'U';

    return (
        <>
            <style>{`
                @keyframes avatarRing {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.3), 0 0 20px rgba(255,255,255,0.1); }
                    50%       { box-shadow: 0 0 0 5px rgba(255,255,255,0),  0 0 30px rgba(255,255,255,0.2); }
                }
                @keyframes heroScan {
                    0%   { transform: translateX(-100%); }
                    100% { transform: translateX(500%);  }
                }
                @keyframes dotFloat {
                    0%, 100% { opacity: 0.15; transform: translateY(0);    }
                    50%      { opacity: 0.35; transform: translateY(-6px);  }
                }
                @keyframes blinkDot {
                    0%, 100% { opacity: 1;   }
                    50%      { opacity: 0.3; }
                }
            `}</style>

            {/* Teal gradient stays on-brand */}
            <div className="relative pt-14 pb-10 px-5 overflow-hidden"
                style={{ background: 'linear-gradient(145deg, #0a4f54 0%, #0d7377 45%, #0e9e8e 100%)' }}>

                {/* Soft white dot texture */}
                {[
                    { w: 4, h: 4, top: '18%', left: '72%', delay: '0s',   dur: '3.5s' },
                    { w: 3, h: 3, top: '40%', left: '88%', delay: '0.7s', dur: '4s'   },
                    { w: 5, h: 5, top: '65%', left: '80%', delay: '1.4s', dur: '3s'   },
                    { w: 3, h: 3, top: '25%', left: '60%', delay: '2s',   dur: '4.5s' },
                    { w: 4, h: 4, top: '55%', left: '92%', delay: '0.3s', dur: '3.8s' },
                ].map((d, i) => (
                    <div key={i} className="absolute rounded-full bg-white pointer-events-none"
                        style={{ width: d.w, height: d.h, top: d.top, left: d.left,
                            animation: `dotFloat ${d.dur} ease-in-out infinite`,
                            animationDelay: d.delay }} />
                ))}

                {/* Ambient glows */}
                <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)' }} />
                <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)' }} />

                {/* ── Top bar ── */}
                <div className="relative z-20 flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate('/home')}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/15 text-white border border-white/25 hover:bg-white/25 transition-all active:scale-90 backdrop-blur-sm"
                    >
                        <ArrowLeft size={18} />
                    </button>

                    {/* Live pill */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/25 backdrop-blur-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-white"
                            style={{ animation: 'blinkDot 2s ease-in-out infinite' }} />
                        <span className="text-[10px] font-black text-white/90 uppercase tracking-[0.25em]">Live</span>
                    </div>
                </div>

                {/* ── Avatar + Identity row ── */}
                <div className="relative z-20 flex items-center gap-4 mb-7">

                    {/* Avatar */}
                    <div className="relative shrink-0 cursor-pointer" onClick={() => navigate('/profile')}>
                        <div className="w-[68px] h-[68px] rounded-2xl overflow-hidden border-2 border-white/40"
                            style={{ animation: 'avatarRing 3.5s ease-in-out infinite' }}>
                            {!photoUrl || imgError ? (
                                <div className="w-full h-full flex items-center justify-center bg-white/20 backdrop-blur-md">
                                    <span className="text-xl font-black text-white">{initials}</span>
                                </div>
                            ) : (
                                <img src={photoUrl} alt="" className="w-full h-full object-cover"
                                    onError={() => setImgError(true)} />
                            )}
                        </div>
                        {/* Zap badge */}
                        <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 bg-white rounded-md flex items-center justify-center shadow-md">
                            <Zap size={10} style={{ color: '#0d7377', fill: '#0d7377' }} />
                        </div>
                    </div>

                    {/* Identity */}
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-white/70 uppercase tracking-[0.22em] mb-0.5">
                            {getGreeting()}
                        </p>
                        <h1 className="text-[22px] font-black text-white leading-none tracking-tight truncate drop-shadow-sm">
                            {user?.firstName} {user?.lastName}
                        </h1>
                        <div className="flex items-center gap-1 mt-2">
                            <MapPin size={10} className="text-white/50 shrink-0" />
                            <span className="text-[11px] text-white/55 font-medium">Casablanca, Morocco</span>
                        </div>
                    </div>
                </div>

                {/* ── Section divider ── */}
                <div className="relative z-20 flex items-center gap-3">
                    <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.4), transparent)' }} />
                    <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.35em]">My Incidents</span>
                    <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, rgba(255,255,255,0.4), transparent)' }} />
                </div>

                {/* ── Scan line at bottom ── */}
                <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden bg-white/10">
                    <div className="absolute top-0 h-full w-28"
                        style={{
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                            animation: 'heroScan 4s ease-in-out infinite',
                        }} />
                </div>
            </div>
        </>
    );
};
