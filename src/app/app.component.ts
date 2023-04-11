/**
 * © Collins Aerospace https://www.collinsaerospace.com/
 *
 * long description for the file
 *
 * @summary short description for the file
 * @author Ranjoy Sen <ranjoy.sen@collins.com>
 *
 * Created at     : 2023-04-01 11:16:32
 * Last modified  : 2023-04-10 21:02:11
 */

/* global performance */

import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { Chart, registerables } from "chart.js";
import { combineSubMatrices, generateMatrixBasedOnSize, matrixMultiplicationCPU, splitMatrix } from "./algo/matrix-multiplication.raw";
declare const matrixMultiplicationGPU: any;

@Component({
	selector: "app-root",
	templateUrl: "app.component.html",
	styleUrls: [
		"app.component.scss" //
	]
})

/**
 * @description App Component
 * @author Ranjoy Sen
 */
export class AppComponent implements AfterViewInit
{
	@ViewChild("barCanvas")
	private _barCanvas!: ElementRef;
	private _barChart: Chart | undefined;

	matrixMultiplicationRange: number[] = [
		1, //
		128,
		256,
		512,
		1024
	];

	/**
	 *
	 *
	 * @memberof AppComponent
	 */
	isJSSlotVisible = true;

	/**
	 * @description Determines whether web worker slot visible is
	 */
	isWebWorkerSlotVisible = false;
	isWebAssemblySlotVisible = false;
	isGPUSlotVisible = false;

	JSMatrixMultiplicationRangeIndex = 0;
	JSMatrixMultiplicationSize = 0;
	timeSpentOnJSMatrixMultiplication: number[] = [
		//
	];
	JSMatrixMultiplicationInProgress = false;

	webWorkerMatrixMultiplicationRangeIndex = 0;
	webWorkerMatrixMultiplicationSize = 0;
	timeSpentOnWebWorkerMatrixMultiplication: number[] = [
		//
	];
	webWorkerMatrixMultiplicationInProgress = false;

	webAssemblyMatrixMultiplicationRangeIndex = 0;
	webAssemblyMatrixMultiplicationSize = 0;
	timeSpentOnWebAssemblyMatrixMultiplication: number[] = [
		//
	];
	webAssemblyMatrixMultiplicationInProgress = false;

	gpuMatrixMultiplicationRangeIndex = 0;
	gpuMatrixMultiplicationSize = 0;
	timeSpentOnGPUMatrixMultiplication: number[] = [
		//
	];
	gpuMatrixMultiplicationInProgress = false;

	/**
	 * Creates an instance of app component.
	 * @author Ranjoy Sen
	 */
	constructor()
	{
		Chart.register(...registerables);
		Chart.defaults.color = "#989aa2";
		Chart.defaults.font.size = 20;
	}

	/**
	 * @description Calculates java script matrix multiplication
	 * @author Ranjoy Sen
	 */
	calculateJavaScriptMatrixMultiplication()
	{
		this.JSMatrixMultiplicationSize = this.matrixMultiplicationRange[
			this.JSMatrixMultiplicationRangeIndex //
		];

		const START_TIME = performance.now();
		matrixMultiplicationCPU(this.JSMatrixMultiplicationSize);
		const END_TIME = performance.now();
		const TOTAL_TIME = END_TIME - START_TIME;
		this.timeSpentOnJSMatrixMultiplication = [
			...this.timeSpentOnJSMatrixMultiplication, //
			TOTAL_TIME
		];
		this.barChartMethod();
	}

	calculateWebWorkerMatrixMultiplication()
	{
		if (this.webWorkerMatrixMultiplicationRangeIndex !== 0)
		{
			const START_TIME = performance.now();

			this.webWorkerMatrixMultiplicationSize = this.matrixMultiplicationRange[
				this.webWorkerMatrixMultiplicationRangeIndex //
			];

			const matrixBlockSize = this.webWorkerMatrixMultiplicationSize < 1024 ? this.webWorkerMatrixMultiplicationSize / 2 : 512;
			const matrix1: number[][] = generateMatrixBasedOnSize(this.webWorkerMatrixMultiplicationSize);
			const matrix2: number[][] = generateMatrixBasedOnSize(this.webWorkerMatrixMultiplicationSize);

			const subMatrices1 = splitMatrix(matrix1, matrixBlockSize);
			const subMatrices2 = splitMatrix(matrix2, matrixBlockSize);

			const numBlocks = matrix1.length / matrixBlockSize;

			// Initialize result matrix
			const subMatricesC: any[][] = [];
			let loop = 0;
			let workerReturnLoop = 0;

			for (let i = 0; i < numBlocks; i++)
			{

				for (let j = 0; j < numBlocks; j++)
				{
					const subMatrixC: any[] = [];
					let sum = 0;

					// Multiply corresponding sub-matrices
					for (let k = 0; k < numBlocks; k++)
					{
						loop++;
						const indexedSubMatrices1 = subMatrices1[i * numBlocks + k];
						const indexedSubMatrices2 = subMatrices2[k * numBlocks + j];

						// Create a new
						const MATRIX_MULTIPLICATION_WORKER = new Worker(new URL("algo/matrix-multiplication.worker.ts", import.meta.url));
						MATRIX_MULTIPLICATION_WORKER.postMessage({
							matrix1: indexedSubMatrices1,
							matrix2: indexedSubMatrices2
						});

						MATRIX_MULTIPLICATION_WORKER.onmessage = ({ data }) =>
						{
							workerReturnLoop++;
							subMatrixC.push(data.subMatrixResult);

							// second loop end 
							if (workerReturnLoop % numBlocks == 0)
							{
								subMatricesC.push(subMatrixC);
							}

							// second loop end
							if (workerReturnLoop === loop)
							{
								const result = combineSubMatrices(subMatricesC);

								const END_TIME = performance.now();
								const TOTAL_TIME = END_TIME - START_TIME;
								this.timeSpentOnWebWorkerMatrixMultiplication = [
									...this.timeSpentOnWebWorkerMatrixMultiplication, //
									TOTAL_TIME
								];
								this.barChartMethod();

							}
						};
					}
				}
			}
		}

	}

	calculateWebAssemblyMatrixMultiplication()
	{
		if (this.webAssemblyMatrixMultiplicationRangeIndex !== 0)
		{
			const START_TIME = performance.now();

			this.webAssemblyMatrixMultiplicationSize = this.matrixMultiplicationRange[
				this.webAssemblyMatrixMultiplicationRangeIndex //
			];

			const matrixBlockSize = 32;

			const numBlocks = this.webAssemblyMatrixMultiplicationSize / matrixBlockSize;

			// Initialize result matrix
			const subMatricesC: any[][] = [];
			let workerReturnLoop = 0;

			for (let i = 0; i < numBlocks; i++)
			{



				// Create a new
				const MATRIX_MULTIPLICATION_WORKER = new Worker(new URL("algo/matrix-multiplication-webassembly.worker.ts", import.meta.url));
				MATRIX_MULTIPLICATION_WORKER.postMessage({
					matrixSize: matrixBlockSize
				});

				MATRIX_MULTIPLICATION_WORKER.onmessage = ({ data }) =>
				{
					workerReturnLoop++;
					
					if (workerReturnLoop % numBlocks == 0)
					{
						// this brings the result of all the web workers to perform matrix 
						// multiplication of the individual block matrices(size 32)
						// todo - all matrices needs to be added to summarize the multiplication

						const END_TIME = performance.now();
						const TOTAL_TIME = END_TIME - START_TIME;
						this.timeSpentOnWebAssemblyMatrixMultiplication = [
							...this.timeSpentOnWebAssemblyMatrixMultiplication, //
							TOTAL_TIME
						];
						this.barChartMethod();
					}


				};
			}

		}

	}

	/**
	 * @description Calculates gpu matrix multiplication
	 * @author Ranjoy Sen
	 */
	calculateGPUMatrixMultiplication()
	{
		this.gpuMatrixMultiplicationInProgress = true;

		this.matrixMultiplicationRange.map((eachRangeValue, index) =>
		{
			if (index !== 0)
			{

				const startTime = performance.now();

				const totalMatrixLength = eachRangeValue * eachRangeValue;
				// calculation start

				// Create a new Float32Array with N elements
				const matrix = new Int32Array(totalMatrixLength);

				// Loop over the elements in the array and set their values
				for (let i = 0; i < totalMatrixLength; i++)
				{
					matrix[i] = i * Math.random();
				}

				const firstMatrix = [eachRangeValue, eachRangeValue, ...matrix];
				const secondMatrix = [eachRangeValue, eachRangeValue, ...matrix];

				// access window and call the function
				matrixMultiplicationGPU(firstMatrix, secondMatrix);

				// calculation end
				const endTime = performance.now();
				const totalTime = endTime - startTime;

				this.timeSpentOnGPUMatrixMultiplication = [
					...this.timeSpentOnGPUMatrixMultiplication, //
					totalTime
				];
				this.barChartMethod();

				if (index === this.matrixMultiplicationRange.length - 1)
				{
					this.gpuMatrixMultiplicationInProgress = false;
				}

			}
		});
	}

	/**
	 * @description Bars chart method
	 * @author Ranjoy Sen
	 */
	barChartMethod()
	{
		// generate labels based on range
		let labels: string[] = [];
		this.matrixMultiplicationRange.map((eachRange, index) =>
		{
			if (index > 0)
			{
				labels = [
					...labels,
					`${eachRange}X${eachRange}`
				]
			}
		}
		)
		// Now we need to supply a Chart element reference with an object that defines the type of chart we want to use, and the type of data we want to display.
		if (!this._barChart)
		{
			this._barChart = new Chart(this._barCanvas.nativeElement, {
				type: "line",
				data: {
					labels: labels,
					datasets: [
						{
							data: this.timeSpentOnGPUMatrixMultiplication,
							backgroundColor: "#ff4961",
							borderWidth: 2,
							borderColor: "#ff4961"
						},
						{
							data: this.timeSpentOnWebAssemblyMatrixMultiplication,
							backgroundColor: "#2fdf75",
							borderWidth: 2,
							borderColor: "#2fdf75"
						},
						{
							data: this.timeSpentOnWebWorkerMatrixMultiplication,
							backgroundColor: "#50c8ff",
							borderWidth: 2,
							borderColor: "#50c8ff"
						},
						{
							data: this.timeSpentOnJSMatrixMultiplication,
							backgroundColor: "#f4f5f8",
							borderWidth: 2,
							borderColor: "#f4f5f8"
						}
					]
				},
				options: {
					responsive: true,
					plugins: {
						legend: {
							display: false,
							labels: {
								// This more specific font property overrides the global property
								font: {
									size: 14
								}
							}
						},
						title: {
							display: true,
							text: "Time To Calculate Matrix Multiplication"
						}
					},
					interaction: {
						intersect: false
					},
					scales: {
						x: {
							display: true,
							title: {
								display: true,
								text: "Number of elements in matrix"
							}
						},
						y: {
							display: true,
							title: {
								display: true,
								text: "millisecond(s)"
							}
						}
					}
				}
			});
		} else
		{
			this._barChart.data.datasets[3].data = this.timeSpentOnJSMatrixMultiplication;
			this._barChart.data.datasets[2].data = this.timeSpentOnWebWorkerMatrixMultiplication;
			this._barChart.data.datasets[1].data = this.timeSpentOnWebAssemblyMatrixMultiplication;
			this._barChart.data.datasets[0].data = this.timeSpentOnGPUMatrixMultiplication;
			this._barChart.update();
		}
	}

	/**
	 * @description Shows next slot
	 * @author Ranjoy Sen
	 * @param slot 
	 */
	showNextSlot(slot: string)
	{
		switch (slot)
		{
			case "JS":
				this.isJSSlotVisible = true;
				break;
			case "WW":
				this.isWebWorkerSlotVisible = true;
				break;
			case "WA":
				this.isWebAssemblySlotVisible = true;
				break;
			case "GPU":
				this.isGPUSlotVisible = true;
				break;

			default:
				break;
		}
	}

	/**
	 * @description after view init
	 * @author Ranjoy Sen
	 */
	ngAfterViewInit()
	{
		this.barChartMethod();
	}
}
