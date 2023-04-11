/**
 * © Collins Aerospace https://www.collinsaerospace.com/
 *
 * long description for the file
 *
 * @summary short description for the file
 * @author Ranjoy Sen <ranjoy.sen@collins.com>
 *
 * Created at     : 2023-04-06 11:43:00 
 * Last modified  : 2023-04-07 16:30:21
 */

import { multiplyMatrices } from './matrix-multiplication.raw';
 
/// <reference lib='webworker' />
 
 /**
  * @description Add event listener
  */
addEventListener('message', ({ data }) =>
{
	//const startTime = performance.now();
	const subMatrixResult = multiplyMatrices(
		data.matrix1,
		data.matrix1
	);
	//const endTime = performance.now();
	//const totalTime = endTime - startTime;
	postMessage({
		//totalTime: totalTime,
		subMatrixResult: subMatrixResult
	});
 });
 