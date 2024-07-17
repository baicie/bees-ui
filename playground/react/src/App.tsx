import '@bees-ui/button';

function App() {
  return (
    <div>
      <bees-button type="primary">
        <div slot="pre">pre</div>
        demo
        <div>dome222</div>
        <div slot="post">post</div>
      </bees-button>
    </div>
  );
}

export default App;
