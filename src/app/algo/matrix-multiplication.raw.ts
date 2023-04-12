/**
 * @description matrix multiplication CPU
 * @author Ranjoy Sen
 * @param {number} matrixSize
 */
export const matrixMultiplicationCPU = (matrixSize: number) =>
{
	const matrixBlockSize = 128;
	const matrix1: number[][] = generateMatrixBasedOnSize(matrixSize);
	const matrix2: number[][] = generateMatrixBasedOnSize(matrixSize);

	const resultMatrix: number[][] = blockMatrixMultiplication(matrix1, matrix2, matrixBlockSize);

	return resultMatrix;


};

export const generateMatrixBasedOnSize = (matrixSize: number) =>
{
	const matrix: number[][] = [];

	for (let i = 0; i < matrixSize; i++)
	{
		matrix[i] = [];

		for (let j = 0; j < matrixSize; j++)
		{
			matrix[i][j] = Math.floor(Math.random() * 10);
		}
	}

	return matrix;
}

export const splitMatrix = (matrix: number[][], blockSize: number) =>
{
	const subMatrices = [];
	const numBlocks = matrix.length / blockSize;

	for (let i = 0; i < numBlocks; i++)
	{
		for (let j = 0; j < numBlocks; j++)
		{
			const subMatrix = [];

			for (let k = 0; k < blockSize; k++)
			{
				const row = matrix[i * blockSize + k].slice(j * blockSize, (j + 1) * blockSize);
				subMatrix.push(row);
			}

			subMatrices.push(subMatrix);
		}
	}

	return subMatrices;
}

// Perform matrix multiplication using block matrix multiplication
export const blockMatrixMultiplication = (matrix1: number[][], matrix2: number[][], blockSize: number) =>
{
	// Split matrices into sub-matrices
	const subMatrices1 = splitMatrix(matrix1, blockSize);
	const subMatrices2 = splitMatrix(matrix2, blockSize);

	const numBlocks = matrix1.length / blockSize;

	// Initialize result matrix
	const subMatricesC = [];

	for (let i = 0; i < numBlocks; i++)
	{

		for (let j = 0; j < numBlocks; j++)
		{
			const subMatrixC = [];
			let sum = 0;

			// Multiply corresponding sub-matrices
			for (let k = 0; k < numBlocks; k++)
			{
				const indexedSubMatrices1 = subMatrices1[i * numBlocks + k];
				const indexedSubMatrices2 = subMatrices2[k * numBlocks + j];
				const subMatrixResult = multiplyMatrices(indexedSubMatrices1, indexedSubMatrices2);
				subMatrixC.push(subMatrixResult);
				
			}

			subMatricesC.push(subMatrixC);
			
		}
	}

	const result = combineSubMatrices(subMatricesC);

	return result;
}

// Multiply two matrices and return the result
export const multiplyMatrices = (matrix1: number[][], matrix2: number[][]) =>
{
	const result: number[][] = [];

	for (let i = 0; i < matrix1.length; i++)
	{
		result[i] = [];

		for (let j = 0; j < matrix2[0].length; j++)
		{
			let sum = 0;

			for (let k = 0; k < matrix2.length; k++)
			{
				sum += matrix1[i][k] * matrix2[k][j];
			}

			result[i][j] = sum;
		}
	}
	return result;
}

export const combineSubMatrices = (subMatrices: any) =>
{
	const numBlocks = Math.sqrt(subMatrices.length);
	const blockSize = subMatrices[0][0].length;
	const matrixSize = numBlocks * blockSize;

	console.log(numBlocks, blockSize, matrixSize);

	let resultMatrix: any[] = [];

	for (let i = 0; i < subMatrices.length; i++)
	{
		resultMatrix = [
			...resultMatrix,
			addMatrices(subMatrices[i])
		]
	}

	const groupMatrixByBlock = groupMatrix(resultMatrix, numBlocks);


	let groupMatrixCombination: any[] = mapEveryIndexOfGroupMatrix(numBlocks, blockSize, groupMatrixByBlock);
	return groupMatrixCombination;
}


export const mapEveryIndexOfGroupMatrix = (numBlocks: number, blockSize: any, groupMatrixByBlock: any[]) =>
{
	let groupMatrixCombination: any[] = [];
	for (let i = 0; i < numBlocks; i++)
	{
		for (let k = 0; k < blockSize; k++)
		{
			let row: any[] = [];
			for (let j = 0; j < numBlocks; j++)
			{
				row = [
					...row,
					...groupMatrixByBlock[i][j][k]
				];
			}
			groupMatrixCombination = [
				...groupMatrixCombination,
				row
			];
		}
	}
	return groupMatrixCombination;
}

/**
 * @description This is a JavaScript function named groupMatrix that takes in two parameters: subMatrices and blockSize.
	subMatrices is an array of any type and blockSize is a number that specifies the size of each block.
	The function creates an empty array called result.
	It then loops through the subMatrices array in blocks of size blockSize. For each block, the function creates a new array called group that contains the elements of the block. The slice method is used to extract a subarray from subMatrices that starts at the current index i and ends at the current index plus the blockSize parameter.
	The group array is then pushed into the result array using the push method.
	Finally, the function returns the result array, which contains all of the blocks of subMatrices grouped into arrays of blockSize elements.
 * @author Ranjoy Sen
 * @param subMatrices 
 * @param blockSize 
 * @returns  
 */
export const groupMatrix = (subMatrices: any, blockSize: number) => 
{
	const result = [];
	for (let i = 0; i < subMatrices.length; i += blockSize)
	{
		const group = subMatrices.slice(i, i + blockSize);
		result.push(group);
	}
	return result;
}

/**
 * @description This is a JavaScript function that takes in an array of matrices and returns a new matrix that is the sum of all the matrices in the input array.
	The function starts by getting the number of rows and columns of the first matrix in the input array. This assumes that all the matrices in the array have the same dimensions.
	It then initializes a new matrix called sumMatrix with the same dimensions as the first matrix and fills it with zeros.
	Next, the function loops through each matrix in the input array and adds its values to the corresponding positions in the sumMatrix. This is done by using nested for loops to iterate through each element of each matrix and add it to the corresponding element in the sumMatrix.
	Finally, the function returns the sumMatrix.
	The function takes one parameter, matrices, which is an array of matrices. The type of the parameter is set to any, which means that it can be any data type.
	Note that the function assumes that all matrices in the input array have the same dimensions. If this is not the case, the function may produce unexpected results.
 * @author Ranjoy Sen
 * @param matrices 
 * @returns  
 */
export const addMatrices = (matrices: any) =>
{
	// Get the dimensions of the first matrix
	const numRows = matrices[0].length;
	const numCols = matrices[0][0].length;

	// Initialize a new matrix to store the sum
	const sumMatrix = [];
	for (let i = 0; i < numRows; i++)
	{
		sumMatrix.push(new Array(numCols).fill(0));
	}

	// Add each matrix to the sum matrix
	for (let i = 0; i < matrices.length; i++)
	{
		const matrix = matrices[i];
		for (let j = 0; j < numRows; j++)
		{
			for (let k = 0; k < numCols; k++)
			{
				sumMatrix[j][k] += matrix[j][k];
			}
		}
	}

	return sumMatrix;
}

export const convertLinearArrayTo2DMatrix = (linearArray: number[], matrixSize: number) =>
{
const rows = matrixSize;
const cols = matrixSize;

const matrix = Array.from({ length: rows }, (_, i) =>
  linearArray.slice(i * cols, (i + 1) * cols)
);
	
	return matrix;
}

export const convert2DMatrixToLinearArray = (matrix: number[][]) =>
{
	return matrix.reduce((acc, curr) => acc.concat(curr), []);
}