import { createContext, JSX, useContext } from 'solid-js';

// 定义 MotionContext 的类型
interface MotionContextProps {
  motion?: boolean;
}

// 创建 MotionContext
const MotionContext = createContext<MotionContextProps>({});

// 定义 MotionProvider 组件
function MotionProvider(props: MotionContextProps & { children?: JSX.Element }) {
  return <MotionContext.Provider value={props}>{props.children}</MotionContext.Provider>;
}

// 使用 MotionContext 的 Hook
function useMotionContext() {
  return useContext(MotionContext);
}

export default MotionProvider;
export { useMotionContext, MotionContext, MotionProvider };
