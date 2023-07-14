import {
  getOutfilePath,
  validateDirPath,
  validateFilePath,
  validateOutfileName,
} from '@metamask/snaps-utils';

import type { YargsArgs } from '../../types/yargs';
import { loadConfig } from '../../utils';
import { evalHandler } from '../eval/evalHandler';
import { manifestHandler } from '../manifest/manifestHandler';
import { bundle } from './bundle';

/**
 * Builds all files in the given source directory to the given destination
 * directory.
 *
 * Creates destination directory if it doesn't exist.
 *
 * @param argv - Argv from Yargs.
 * @param argv.src - The source file path.
 * @param argv.dist - The output directory path.
 * @param argv.outfileName - The output file name.
 */
export async function build(argv: YargsArgs): Promise<void> {
  const { src, dist, outfileName } = argv;
  if (outfileName) {
    validateOutfileName(outfileName);
  }
  await validateFilePath(src);
  await validateDirPath(dist, true);

  const outfilePath = getOutfilePath(dist, outfileName);
  const result = await bundle(
    src,
    outfilePath,
    argv,
    loadConfig().bundlerCustomizer,
  );
  if (result && argv.eval) {
    await evalHandler({ ...argv, bundle: outfilePath });
  }

  if (argv.manifest) {
    await manifestHandler(argv);
  }
}
