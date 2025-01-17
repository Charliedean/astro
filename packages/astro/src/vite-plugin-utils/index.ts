import ancestor from 'common-ancestor-path';
import { fileURLToPath } from 'node:url';
import type { AstroConfig } from '../@types/astro.js';
import {
	appendExtension,
	appendForwardSlash,
	removeLeadingForwardSlashWindows,
} from '../core/path.js';
import { viteID } from '../core/util.js';

export function getFileInfo(id: string, config: AstroConfig) {
	const sitePathname = appendForwardSlash(
		config.site ? new URL(config.base, config.site).pathname : config.base
	);

	const fileId = id.split('?')[0];
	let fileUrl = fileId.includes('/pages/')
		? fileId
				.replace(/^.*?\/pages\//, sitePathname)
				.replace(/(\/index)?\.(md|markdown|mdown|mkdn|mkd|mdwn|md|astro)$/, '')
		: undefined;
	if (fileUrl && config.trailingSlash === 'always') {
		fileUrl = appendForwardSlash(fileUrl);
	}
	if (fileUrl && config.build.format === 'file') {
		fileUrl = appendExtension(fileUrl, 'html');
	}
	return { fileId, fileUrl };
}

/**
 * Normalizes different file names like:
 *
 * - /@fs/home/user/project/src/pages/index.astro
 * - /src/pages/index.astro
 *
 * as absolute file paths with forward slashes.
 */
export function normalizeFilename(filename: string, root: URL) {
	if (filename.startsWith('/@fs')) {
		filename = filename.slice('/@fs'.length);
	} else if (filename.startsWith('/') && !ancestor(filename, fileURLToPath(root))) {
		const url = new URL('.' + filename, root);
		filename = viteID(url);
	}
	return removeLeadingForwardSlashWindows(filename);
}

const postfixRE = /[?#].*$/s;
export function cleanUrl(url: string): string {
	return url.replace(postfixRE, '');
}
