const ApiSchema: any = ({ name }) => {
  return (constructor: any) => {
    const wrapper = class extends constructor {};
    Object.defineProperty(wrapper, 'name', {
      value: name,
      writable: false,
    });
    return wrapper;
  };
};

export default ApiSchema;
