import infos from '../infos.json';

/**
 * @description - Ensure getting application infos (~2ms)
 * @returns {Promise<unknown>}
 */
export function getAppInfos() {
  return infos;
}
