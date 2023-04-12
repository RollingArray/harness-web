import { environment } from 'src/environments/environment';
import { convert2DMatrixToLinearArray, convertLinearArrayTo2DMatrix } from './matrix-multiplication.raw';
 
/// <reference lib='webworker' />
declare const WebAssembly: any;
 
 /**
  * @description Add event listener
  */
addEventListener('message', ({ data }) =>
{
	const importObject = { imports: { imported_func: (arg: any) => console.log(arg) } };
	// Initialize the matrix calculation wasm file 
	WebAssembly.instantiateStreaming(fetch(`${environment.wasmApiBaseUrl}main.wasm`), importObject)
		.then((obj: any) =>
		{
			const { matrixMultiplication, memory } = obj.instance.exports;
			
			const totalMatrixLength = data.matrixSize * data.matrixSize;

			let matrix1: number[] = [];
			let matrix2: number[] = [];
			for (let index = 0; index < totalMatrixLength ; index++) {
				matrix1 = [
					...matrix1,
					index * Math.random()
				];
				matrix2 = [
					...matrix2,
					index * Math.random()
				];
			}
			// Create the arrays.
			//const length = 5

			let offset = 0
			const array1 = new Int32Array(memory.buffer, offset, totalMatrixLength)
			array1.set(matrix1)

			offset += totalMatrixLength * Int32Array.BYTES_PER_ELEMENT
			const array2 = new Int32Array(memory.buffer, offset, totalMatrixLength)
			array2.set(matrix2)

			offset += totalMatrixLength * Int32Array.BYTES_PER_ELEMENT
			const result = new Int32Array(memory.buffer, offset, totalMatrixLength)

			// Call the function.
			matrixMultiplication(
				array1.byteOffset,
				array2.byteOffset,
				result.byteOffset,
				data.matrixSize
			)
			
			console.log()
			postMessage({
				blockIndex: data.blockIndex,
				result: convertLinearArrayTo2DMatrix(Array.from(result), data.matrixSize)
			});
		})
		.catch((err: any) => console.log('fetch error: ', err));
 });
 
