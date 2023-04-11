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
			
			const totalMatrixLength = data.matrixSize;

			// Call the function.
			matrixMultiplication(
				totalMatrixLength
			)
			
			postMessage({
				result: true
			});
		})
		.catch((err: any) => console.log('fetch error: ', err));
 });
 
