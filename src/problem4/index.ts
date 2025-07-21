function sum_to_n_a(n: number): number {
  return (n * (n + 1)) / 2;
}

function sum_to_n_b(n: number): number {
  return Array.from({ length: n }, (_, i) => i + 1).reduce(
    (acc, curr) => acc + curr,
    0
  );
}

function sum_to_n_c(n: number): number {
  // use recursion
  if (n === 0) return 0;
  return n + sum_to_n_c(n - 1);
}

console.log(sum_to_n_a(10));
console.log(sum_to_n_b(10));
console.log(sum_to_n_c(10));
