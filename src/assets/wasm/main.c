#include <emscripten.h>
#include <stdlib.h>
#include <stdio.h>

#define BLOCK_SIZE 128

// compile this code using emcc compiler
// emcc --no-entry main.c -s WASM=1 -o public/main.wasm

// Flag details:
// main.c is the name of the input file containing the C code,
// main.wasm is the name of the output file where the WebAssembly binary code will be written
// it will be pushed din public folder
// -s WASM=1 is the flag that tells emcc to generate WebAssembly binary code
// -O3 is an optimization flag that tells the compiler to perform aggressive optimization.

EMSCRIPTEN_KEEPALIVE
int matrixMultiplication(int N) {

  int *a = (int*) malloc(N * N * sizeof(int));
  int *b = (int*) malloc(N * N * sizeof(int));
  int *c = (int*) malloc(N * N * sizeof(int));

  // initialize matrices a and b with random values
  for (int i = 0; i < N * N; ++i) {
    a[i] = rand() % 10;
    b[i] = rand() % 10;
  }

  // perform matrix multiplication
  for (int ii = 0; ii < N; ii += BLOCK_SIZE) {
    for (int jj = 0; jj < N; jj += BLOCK_SIZE) {
      for (int kk = 0; kk < N; kk += BLOCK_SIZE) {
        for (int i = ii; i < ii + BLOCK_SIZE; ++i) {
          for (int j = jj; j < jj + BLOCK_SIZE; j += 4) {
            int c0 = c[i * N + j];
            int c1 = c[i * N + j + 1];
            int c2 = c[i * N + j + 2];
            int c3 = c[i * N + j + 3];
            for (int k = kk; k < kk + BLOCK_SIZE; ++k) {
              int aik = a[i * N + k];
              int bkj = b[k * N + j];
              c0 += aik * bkj;
              bkj = b[k * N + j + 1];
              c1 += aik * bkj;
              bkj = b[k * N + j + 2];
              c2 += aik * bkj;
              bkj = b[k * N + j + 3];
              c3 += aik * bkj;
            }
            c[i * N + j] = c0;
            c[i * N + j + 1] = c1;
            c[i * N + j + 2] = c2;
            c[i * N + j + 3] = c3;
          }
        }
      }
    }
  }

  free(a);
  free(b);
  free(c);
  return 0;
}


/**
 * This function takes three int pointers (a, b, and c) as input, which represent the matrices A, B, and C, respectively. 
 * The m, n, and p arguments are the dimensions of the matrices (A has dimensions m x n, B has dimensions n x p, and C 
 * has dimensions m x p).The function uses three nested loops to iterate over the rows and columns of the matrices and 
 * perform the multiplication. The sum variable accumulates the result of each element of the product, and the result 
 * is stored in the c matrix.
*/
EMSCRIPTEN_KEEPALIVE
void matrix_multiply(int *a, int *b, int *c, int m, int n, int p) {
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < p; j++) {
            int sum = 0;
            for (int k = 0; k < n; k++) {
                sum += a[i * n + k] * b[k * p + j];
            }
            c[i * p + j] = sum;
        }
    }
}