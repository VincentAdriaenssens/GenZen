import type { CSSProperties } from 'react';
import type { IconName } from '../types';

interface IconProps {
	name: IconName;
	className?: string;
	style?: CSSProperties;
}

const iconPaths: Record<IconName, string> = {
	spark: 'M12 2l1.8 4.6L18 8.4l-4.2 1.8L12 15l-1.8-4.8L6 8.4l4.2-1.8L12 2zm7 10l.9 2.1L22 15l-2.1.9L19 18l-.9-2.1L16 15l2.1-.9L19 12zM5 14l1 2.5L8.5 17 6 18l-1 2.5L4 18l-2.5-1L4 16.5 5 14z',
	clock:
		'M12 2a10 10 0 100 20 10 10 0 000-20zm0 3a1 1 0 011 1v5.1l3.2 1.9a1 1 0 11-1 1.8l-3.7-2.2A1 1 0 0111 12V6a1 1 0 011-1z',
	gift: 'M20 7h-2.2A3 3 0 0012 4a3 3 0 00-5.8 3H4a1 1 0 00-1 1v3h2v8a2 2 0 002 2h10a2 2 0 002-2v-8h2V8a1 1 0 00-1-1zm-8-1a1 1 0 011 1v0h-2v0a1 1 0 011-1zm-4 0a1 1 0 011 1v0H7v0a1 1 0 011-1zm3 5v8H7v-8h4zm2 0h4v8h-4v-8zm6-2H5V9h14v0z',
	tasks:
		'M9 6h11v2H9V6zm0 5h11v2H9v-2zm0 5h11v2H9v-2zM4 6h2v2H4V6zm0 5h2v2H4v-2zm0 5h2v2H4v-2z',
	shield:
		'M12 2l7 3v5c0 5-3.4 9.7-7 11-3.6-1.3-7-6-7-11V5l7-3zm0 5a3 3 0 100 6 3 3 0 000-6zm0-2a5 5 0 00-5 5c0 2.5 1.8 5 5 7.1 3.2-2.1 5-4.6 5-7.1a5 5 0 00-5-5z',
	trend:
		'M4 17l5-5 3 3 6-7 2 2-8 9-3-3-3 3H4v-2zm0-10h5v2H4V7zm13 0h3v3h-2V9h-1V7z',
	home: 'M12 3l9 7h-2v9h-5v-6H10v6H5v-9H3l9-7z',
	book: 'M6 4h8a3 3 0 013 3v11a2 2 0 00-2-2H6a2 2 0 01-2-2V6a2 2 0 012-2zm0 2v8h9V7a1 1 0 00-1-1H6zm0 10h9a3 3 0 012 .8V18H7a1 1 0 01-1-1v-1z',
	walk: 'M13 4a2 2 0 11-2 2 2 2 0 012-2zm-1 5l2.4 1.2 1.6 3.3-1.8.9-1.2-2.4-1.4 1.3V20H9v-5.7L7.3 16 6 14.6 9 12l1-3h2z',
	check:
		'M9.5 16.2L4.8 11.5 6.2 10l3.3 3.3L17.8 5l1.4 1.4-9.7 9.8z',
	settings:
		'M19.4 13a7.9 7.9 0 000-2l2-1.5-2-3.4-2.4 1a8.4 8.4 0 00-1.7-1l-.3-2.6h-4l-.3 2.6a8.4 8.4 0 00-1.7 1l-2.4-1-2 3.4L4.6 11a7.9 7.9 0 000 2l-2 1.5 2 3.4 2.4-1c.5.4 1.1.7 1.7 1l.3 2.6h4l.3-2.6c.6-.3 1.2-.6 1.7-1l2.4 1 2-3.4-2-1.5zM12 15.2a3.2 3.2 0 110-6.4 3.2 3.2 0 010 6.4z',
	plus: 'M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7V4z',
	family:
		'M8 12a3 3 0 100-6 3 3 0 000 6zm8 0a3 3 0 100-6 3 3 0 000 6zM8 14c-2.7 0-5 1.5-5 3.4V20h10v-2.6C13 15.5 10.7 14 8 14zm8 0c-.9 0-1.8.2-2.5.5 1 .8 1.5 1.8 1.5 2.9V20h6v-2.6c0-1.9-2.3-3.4-5-3.4z',
	lock: 'M7 10V8a5 5 0 1110 0v2h1a2 2 0 012 2v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7a2 2 0 012-2h1zm2 0h6V8a3 3 0 10-6 0v2zm3 3a2 2 0 012 2 2 2 0 11-4 0 2 2 0 012-2z',
	moon: 'M14.5 3.2A8.8 8.8 0 1019.8 17 7.2 7.2 0 0114.5 3.2z',
	heart: 'M12 20l-1.2-1.1C5.1 13.7 2 10.9 2 7.5 2 5 4 3 6.5 3 8 3 9.5 3.8 10.4 5c.9-1.2 2.4-2 3.9-2C17 3 19 5 19 7.5c0 3.4-3.1 6.2-8.8 11.4L12 20z',
	close: 'M6.4 5L12 10.6 17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4L12 13.4 6.4 19 5 17.6 10.6 12 5 6.4 6.4 5z',
};

export default function Icon({ name, className, style }: IconProps) {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			className={className}
			style={style}
		>
			<path d={iconPaths[name]} fill="currentColor" />
		</svg>
	);
}
