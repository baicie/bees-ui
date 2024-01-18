try {
  require('./dist/index.cjs')
  console.log('success');
} catch (error) {
  console.log(error);
}
