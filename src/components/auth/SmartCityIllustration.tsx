import React from 'react';

interface SmartCityIllustrationProps {
    variant?: 'day' | 'night';
    className?: string;
}

export const SmartCityIllustration: React.FC<SmartCityIllustrationProps> = ({
    variant = 'day',
    className = '',
}) => {
    const isNight = variant === 'night';

    // Color palette
    const colors = {
        sky: isNight ? '#053B3E' : '#',
        building1: isNight ? '#263238' : '#0D7377',
        building2: isNight ? '#37474F' : '#32936F',
        building3: isNight ? '#455A64' : '#1E5A42',
        window: isNight ? '#14FFEC' : '#00D9FF',
        windowDim: isNight ? '#0D7377' : '#B2EBF2',
        tree: '#7DDF64',
        treeDark: '#5FD19B',
        road: isNight ? '#1A2631' : '#546E7A',
        roadLine: isNight ? '#FFB347' : '#ECEFF1',
        person: isNight ? '#B0BEC5' : '#263238',
        ground: isNight ? '#263238' : '#81C784',
        connection: '#14FFEC',
        sun: '#FFD54F',
        moon: '#E3F2FD',
        solar: '#7DDF64',
    };

    return (
        <svg
            viewBox="0 0 400 320"
            className={`w-full h-auto rounded-3xl ${className}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Sky background */}
            <rect width="400" height="320" fill={colors.sky} />

            {/* Sun or Moon */}
            {isNight ? (
                <>
                    <circle cx="340" cy="50" r="25" fill={colors.moon} opacity="0.9" />
                    <circle cx="345" cy="45" r="20" fill={colors.sky} />
                    {/* Stars */}
                    <g fill="#fff" opacity="0.6">
                        <circle cx="50" cy="35" r="1.5" className="animate-twinkle" />
                        <circle cx="120" cy="60" r="1" className="animate-twinkle" style={{ animationDelay: '0.3s' }} />
                        <circle cx="180" cy="25" r="1.5" className="animate-twinkle" style={{ animationDelay: '0.6s' }} />
                        <circle cx="250" cy="45" r="1" className="animate-twinkle" style={{ animationDelay: '0.9s' }} />
                        <circle cx="290" cy="80" r="1.5" className="animate-twinkle" style={{ animationDelay: '1.2s' }} />
                    </g>
                </>
            ) : (
                <>
                    <circle cx="340" cy="50" r="28" fill={colors.sun} opacity="0.9" />
                    {/* Clouds */}
                    <g fill="#fff" opacity="0.8">
                        <ellipse cx="80" cy="40" rx="25" ry="12" />
                        <ellipse cx="100" cy="35" rx="20" ry="10" />
                        <ellipse cx="220" cy="55" rx="30" ry="14" />
                        <ellipse cx="245" cy="50" rx="22" ry="11" />
                    </g>
                </>
            )}

            {/* Drone in sky */}
            <g transform="translate(280, 85)" className="animate-fade-float">
                <rect x="-8" y="0" width="16" height="4" fill={colors.person} rx="1" />
                <circle cx="-10" cy="2" r="3" fill={colors.person} opacity="0.5" />
                <circle cx="10" cy="2" r="3" fill={colors.person} opacity="0.5" />
                <rect x="-2" y="4" width="4" height="3" fill={colors.connection} opacity="0.8" />
            </g>

            {/* IoT Connection Lines */}
            <g stroke={colors.connection} strokeWidth="0.5" opacity="0.3" strokeDasharray="4,4">
                <path d="M60 140 Q120 100 180 130" className="animate-network" />
                <path d="M180 130 Q240 90 300 120" className="animate-network" style={{ animationDelay: '0.5s' }} />
                <path d="M120 160 Q180 110 240 150" className="animate-network" style={{ animationDelay: '1s' }} />
            </g>

            {/* Building 1 - Tall with Solar Panels */}
            <rect x="30" y="110" width="50" height="145" fill={colors.building1} rx="2" />
            {/* Windows */}
            <g fill={isNight ? colors.window : colors.windowDim}>
                <rect x="38" y="120" width="10" height="14" rx="1" className={isNight ? 'animate-twinkle' : ''} />
                <rect x="54" y="120" width="10" height="14" rx="1" opacity="0.7" className={isNight ? 'animate-twinkle' : ''} style={{ animationDelay: '0.3s' }} />
                <rect x="38" y="145" width="10" height="14" rx="1" opacity="0.8" className={isNight ? 'animate-twinkle' : ''} style={{ animationDelay: '0.6s' }} />
                <rect x="54" y="145" width="10" height="14" rx="1" className={isNight ? 'animate-twinkle' : ''} />
                <rect x="38" y="170" width="10" height="14" rx="1" opacity="0.6" />
                <rect x="54" y="170" width="10" height="14" rx="1" opacity="0.9" />
                <rect x="38" y="195" width="10" height="14" rx="1" opacity="0.7" />
                <rect x="54" y="195" width="10" height="14" rx="1" opacity="0.5" />
            </g>
            {/* Solar Panels */}
            <g fill={colors.solar}>
                <rect x="32" y="100" width="20" height="8" rx="1" />
                <rect x="55" y="100" width="20" height="8" rx="1" />
            </g>
            {/* Antenna */}
            <line x1="55" y1="100" x2="55" y2="85" stroke={colors.connection} strokeWidth="1.5" />
            <circle cx="55" cy="82" r="3" fill={colors.connection} className="animate-sensor-pulse" />

            {/* Building 2 - Medium Wide */}
            <rect x="95" y="145" width="55" height="110" fill={colors.building2} rx="2" />
            {/* Windows grid */}
            <g fill={isNight ? colors.window : colors.windowDim}>
                {[0, 1, 2, 3].map(row =>
                    [0, 1, 2].map(col => (
                        <rect
                            key={`b2-${row}-${col}`}
                            x={103 + col * 16}
                            y={155 + row * 22}
                            width="10"
                            height="14"
                            rx="1"
                            opacity={isNight ? 0.5 + Math.random() * 0.5 : 0.8}
                            className={isNight ? 'animate-twinkle' : ''}
                            style={{ animationDelay: `${(row + col) * 0.2}s` }}
                        />
                    ))
                )}
            </g>
            {/* Green roof */}
            <rect x="100" y="140" width="45" height="5" fill={colors.tree} rx="1" />

            {/* Building 3 - Tallest */}
            <rect x="165" y="95" width="60" height="160" fill={colors.building1} rx="2" />
            <g fill={isNight ? colors.window : colors.windowDim}>
                {[0, 1, 2, 3, 4, 5].map(row =>
                    [0, 1, 2].map(col => (
                        <rect
                            key={`b3-${row}-${col}`}
                            x={175 + col * 16}
                            y={105 + row * 22}
                            width="10"
                            height="14"
                            rx="1"
                            opacity={isNight ? 0.4 + Math.random() * 0.6 : 0.8}
                            className={isNight ? 'animate-twinkle' : ''}
                            style={{ animationDelay: `${(row + col) * 0.15}s` }}
                        />
                    ))
                )}
            </g>
            {/* Helipad marker */}
            <circle cx="195" cy="90" r="8" fill="none" stroke={colors.connection} strokeWidth="1" />
            <text x="192" y="93" fill={colors.connection} fontSize="10" fontFamily="sans-serif">H</text>

            {/* Building 4 - Short modern */}
            <rect x="240" y="175" width="45" height="80" fill={colors.building3} rx="2" />
            <g fill={isNight ? colors.window : colors.windowDim}>
                <rect x="248" y="185" width="12" height="18" rx="1" opacity="0.9" />
                <rect x="265" y="185" width="12" height="18" rx="1" opacity="0.7" />
                <rect x="248" y="210" width="12" height="18" rx="1" opacity="0.6" />
                <rect x="265" y="210" width="12" height="18" rx="1" opacity="0.8" />
            </g>

            {/* Building 5 - Tall slim */}
            <rect x="300" y="115" width="40" height="140" fill={colors.building2} rx="2" />
            <g fill={isNight ? colors.window : colors.windowDim}>
                {[0, 1, 2, 3, 4].map(row => (
                    <React.Fragment key={`b5-${row}`}>
                        <rect x={308} y={125 + row * 24} width="8" height="12" rx="1" opacity={0.5 + Math.random() * 0.5} />
                        <rect x={320} y={125 + row * 24} width="8" height="12" rx="1" opacity={0.5 + Math.random() * 0.5} />
                    </React.Fragment>
                ))}
            </g>
            {/* Wind turbine */}
            <line x1="320" y1="115" x2="320" y2="90" stroke={colors.person} strokeWidth="2" />
            <g transform="translate(320, 90)" className="animate-spin" style={{ transformOrigin: '320px 90px', animationDuration: '4s' }}>
                <line x1="0" y1="0" x2="-12" y2="-8" stroke={colors.solar} strokeWidth="2" />
                <line x1="0" y1="0" x2="12" y2="-8" stroke={colors.solar} strokeWidth="2" />
                <line x1="0" y1="0" x2="0" y2="14" stroke={colors.solar} strokeWidth="2" />
            </g>

            {/* Building 6 - Far right */}
            <rect x="355" y="155" width="35" height="100" fill={colors.building1} rx="2" />
            <g fill={isNight ? colors.window : colors.windowDim}>
                <rect x="360" y="165" width="8" height="10" rx="1" />
                <rect x="372" y="165" width="8" height="10" rx="1" opacity="0.7" />
                <rect x="360" y="185" width="8" height="10" rx="1" opacity="0.8" />
                <rect x="372" y="185" width="8" height="10" rx="1" />
            </g>

            {/* Trees */}
            <g>
                {/* Tree 1 */}
                <rect x="18" y="230" width="6" height="25" fill="#5D4037" />
                <polygon points="21,200 35,230 7,230" fill={colors.tree} />
                <polygon points="21,210 32,230 10,230" fill={colors.treeDark} />

                {/* Tree 2 */}
                <rect x="287" y="235" width="5" height="20" fill="#5D4037" />
                <circle cx="290" cy="222" r="14" fill={colors.tree} />

                {/* Tree 3 */}
                <rect x="375" y="238" width="4" height="17" fill="#5D4037" />
                <circle cx="377" cy="228" r="11" fill={colors.treeDark} />
            </g>

            {/* Ground */}
            <rect x="0" y="255" width="400" height="65" fill={colors.ground} />

            {/* Road */}
            <rect x="0" y="268" width="400" height="22" fill={colors.road} />
            <g fill={colors.roadLine} opacity="0.8">
                {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
                    <rect key={i} x={20 + i * 50} y="278" width="30" height="3" rx="1" />
                ))}
            </g>

            {/* Bike lane */}
            <rect x="0" y="262" width="400" height="5" fill={colors.solar} opacity="0.4" />

            {/* PEOPLE */}
            {/* Person 1 - Walking with bag */}
            <g transform="translate(45, 295)">
                <circle cx="0" cy="-15" r="5" fill={colors.person} />
                <line x1="0" y1="-10" x2="0" y2="0" stroke={colors.person} strokeWidth="2" />
                <line x1="0" y1="0" x2="-4" y2="10" stroke={colors.person} strokeWidth="1.5" />
                <line x1="0" y1="0" x2="4" y2="10" stroke={colors.person} strokeWidth="1.5" />
                <line x1="0" y1="-6" x2="5" y2="-2" stroke={colors.person} strokeWidth="1.5" />
                <rect x="5" y="-4" width="4" height="6" fill={colors.building2} rx="1" />
            </g>

            {/* Person 2 - With smartphone */}
            <g transform="translate(100, 295)">
                <circle cx="0" cy="-15" r="5" fill={colors.person} />
                <line x1="0" y1="-10" x2="0" y2="0" stroke={colors.person} strokeWidth="2" />
                <line x1="0" y1="0" x2="-3" y2="10" stroke={colors.person} strokeWidth="1.5" />
                <line x1="0" y1="0" x2="3" y2="10" stroke={colors.person} strokeWidth="1.5" />
                <line x1="0" y1="-6" x2="-5" y2="-10" stroke={colors.person} strokeWidth="1.5" />
                <rect x="-7" y="-14" width="4" height="6" fill={colors.connection} rx="0.5" />
            </g>

            {/* Person 3 - Running */}
            <g transform="translate(155, 293)">
                <circle cx="0" cy="-15" r="4" fill={colors.person} />
                <line x1="0" y1="-11" x2="-2" y2="-2" stroke={colors.person} strokeWidth="2" />
                <line x1="-2" y1="-2" x2="-8" y2="8" stroke={colors.person} strokeWidth="1.5" />
                <line x1="-2" y1="-2" x2="5" y2="5" stroke={colors.person} strokeWidth="1.5" />
                <line x1="0" y1="-8" x2="6" y2="-12" stroke={colors.person} strokeWidth="1.5" />
                <line x1="0" y1="-8" x2="-5" y2="-5" stroke={colors.person} strokeWidth="1.5" />
            </g>

            {/* Person 4 - Cyclist */}
            <g transform="translate(210, 265)">
                <circle cx="0" cy="-8" r="4" fill={colors.person} />
                <line x1="0" y1="-4" x2="-3" y2="2" stroke={colors.person} strokeWidth="1.5" />
                <circle cx="-10" cy="5" r="6" fill="none" stroke={colors.person} strokeWidth="1.5" />
                <circle cx="10" cy="5" r="6" fill="none" stroke={colors.person} strokeWidth="1.5" />
                <line x1="-10" y1="5" x2="0" y2="0" stroke={colors.person} strokeWidth="1" />
                <line x1="0" y1="0" x2="10" y2="5" stroke={colors.person} strokeWidth="1" />
                <line x1="-3" y1="2" x2="0" y2="0" stroke={colors.person} strokeWidth="1" />
            </g>

            {/* Person 5 & 6 - Couple walking */}
            <g transform="translate(275, 297)">
                <circle cx="0" cy="-15" r="4" fill={colors.person} />
                <line x1="0" y1="-11" x2="0" y2="-2" stroke={colors.person} strokeWidth="2" />
                <line x1="0" y1="-2" x2="-3" y2="8" stroke={colors.person} strokeWidth="1.5" />
                <line x1="0" y1="-2" x2="3" y2="8" stroke={colors.person} strokeWidth="1.5" />
            </g>
            <g transform="translate(285, 297)">
                <circle cx="0" cy="-15" r="4" fill={colors.person} />
                <line x1="0" y1="-11" x2="0" y2="-2" stroke={colors.person} strokeWidth="2" />
                <line x1="0" y1="-2" x2="-3" y2="8" stroke={colors.person} strokeWidth="1.5" />
                <line x1="0" y1="-2" x2="3" y2="8" stroke={colors.person} strokeWidth="1.5" />
            </g>

            {/* Person 7 - With child */}
            <g transform="translate(340, 297)">
                <circle cx="0" cy="-15" r="4" fill={colors.person} />
                <line x1="0" y1="-11" x2="0" y2="-2" stroke={colors.person} strokeWidth="2" />
                <line x1="0" y1="-2" x2="-3" y2="8" stroke={colors.person} strokeWidth="1.5" />
                <line x1="0" y1="-2" x2="3" y2="8" stroke={colors.person} strokeWidth="1.5" />
                <line x1="0" y1="-6" x2="8" y2="-8" stroke={colors.person} strokeWidth="1.5" />
                {/* Child */}
                <circle cx="12" cy="-8" r="3" fill={colors.person} />
                <line x1="12" y1="-5" x2="12" y2="2" stroke={colors.person} strokeWidth="1.5" />
                <line x1="12" y1="2" x2="10" y2="8" stroke={colors.person} strokeWidth="1" />
                <line x1="12" y1="2" x2="14" y2="8" stroke={colors.person} strokeWidth="1" />
            </g>

            {/* Electric Bus */}
            <g transform="translate(70, 270)">
                <rect x="0" y="0" width="40" height="18" fill={colors.building2} rx="3" />
                <rect x="5" y="3" width="8" height="8" fill={colors.window} rx="1" />
                <rect x="16" y="3" width="8" height="8" fill={colors.window} rx="1" />
                <rect x="27" y="3" width="8" height="8" fill={colors.window} rx="1" />
                <circle cx="10" cy="20" r="4" fill={colors.person} />
                <circle cx="30" cy="20" r="4" fill={colors.person} />
                {/* Electric symbol */}
                <text x="35" y="8" fill={colors.solar} fontSize="8">⚡</text>
            </g>

            {/* Smart Street Light */}
            <g transform="translate(185, 250)">
                <line x1="0" y1="0" x2="0" y2="30" stroke={colors.person} strokeWidth="2" />
                <ellipse cx="0" cy="0" rx="8" ry="3" fill={isNight ? colors.window : colors.person} />
                {isNight && (
                    <ellipse cx="0" cy="35" rx="15" ry="8" fill={colors.window} opacity="0.2" />
                )}
                {/* Sensor indicator */}
                <circle cx="5" cy="5" r="2" fill={colors.connection} className="animate-sensor-pulse" />
            </g>

            {/* Bike sharing station */}
            <g transform="translate(130, 300)">
                <rect x="0" y="-5" width="25" height="3" fill={colors.solar} rx="1" />
                {[0, 1, 2].map(i => (
                    <g key={i} transform={`translate(${5 + i * 8}, 0)`}>
                        <circle cx="0" cy="0" r="3" fill="none" stroke={colors.person} strokeWidth="1" />
                        <circle cx="0" cy="0" r="1" fill={colors.person} />
                    </g>
                ))}
            </g>

            {/* EV Charging Station */}
            {isNight && (
                <g transform="translate(350, 278)">
                    <rect x="0" y="0" width="15" height="20" fill={colors.building1} rx="2" />
                    <text x="3" y="12" fill={colors.connection} fontSize="8">⚡</text>
                    <line x1="7" y1="20" x2="7" y2="25" stroke={colors.connection} strokeWidth="2" />
                </g>
            )}

            {/* WiFi signal indicators */}
            <g transform="translate(195, 75)" opacity="0.4">
                <path d="M-8,0 A10,10 0 0,1 8,0" fill="none" stroke={colors.connection} strokeWidth="1" className="animate-signal" />
                <path d="M-12,-5 A15,15 0 0,1 12,-5" fill="none" stroke={colors.connection} strokeWidth="1" className="animate-signal" style={{ animationDelay: '0.3s' }} />
                <path d="M-16,-10 A20,20 0 0,1 16,-10" fill="none" stroke={colors.connection} strokeWidth="1" className="animate-signal" style={{ animationDelay: '0.6s' }} />
            </g>
        </svg>
    );
};
