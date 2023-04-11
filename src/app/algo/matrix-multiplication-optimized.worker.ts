/**
 * © Collins Aerospace https://www.collinsaerospace.com/
 *
 * long description for the file
 *
 * @summary short description for the file
 * @author Ranjoy Sen <ranjoy.sen@collins.com>
 *
 * Created at     : 2023-04-06 11:43:00 
 * Last modified  : 2023-04-07 17:10:34
 */

import { combineSubMatrices, generateMatrixBasedOnSize, matrixMultiplicationCPU, multiplyMatrices, splitMatrix } from './matrix-multiplication.raw';
 
/// <reference lib='webworker' />
 
 /**
  * @description Add event listener
  */
addEventListener('message', ({ data }) =>
{
	const startTime = performance.now();
	// matrixMultiplicationCPU(
	// 	1024
	// );
	// const endTime = performance.now();
	// const totalTime = endTime - startTime;
	// postMessage(totalTime);

	// Split matrices into sub-matrices

	const matrixBlockSize = 32;
	const matrix1: number[][] = generateMatrixBasedOnSize(data.matrixSize);
	const matrix2: number[][] = generateMatrixBasedOnSize(data.matrixSize);
	
	const subMatrices1 = splitMatrix(matrix1, matrixBlockSize);
	const subMatrices2 = splitMatrix(matrix2, matrixBlockSize);

	const numBlocks = matrix1.length / matrixBlockSize;

	// Initialize result matrix
	const subMatricesC = [];

	for (let i = 0; i < numBlocks; i++)
	{

		for (let j = 0; j < numBlocks; j++)
		{
			const subMatrixC: any[] = [];
			let sum = 0;

			// Multiply corresponding sub-matrices
			for (let k = 0; k < numBlocks; k++)
			{
				const indexedSubMatrices1 = subMatrices1[i * numBlocks + k];
				const indexedSubMatrices2 = subMatrices2[k * numBlocks + j];
				
				// Create a new
				const MATRIX_MULTIPLICATION_WORKER = new Worker(new URL("matrix-multiplication.worker.ts", import.meta.url));
				MATRIX_MULTIPLICATION_WORKER.postMessage({
					matrix1: indexedSubMatrices1,
					matrix2: indexedSubMatrices2
				});

				MATRIX_MULTIPLICATION_WORKER.onmessage = ({ data }) =>
				{
					subMatrixC.push(data.subMatrixResult);
				};

				//const subMatrixResult = multiplyMatrices(indexedSubMatrices1, indexedSubMatrices2);
				//sum += subMatrixResult[0][0];
				//subMatrixC.push(subMatrixResult);
			}

			subMatricesC.push(subMatrixC);
		}
	}

	//combineSubMatrices(subMatricesC);

	const endTime = performance.now();
	const totalTime = endTime - startTime;
	postMessage(totalTime);
 });
 