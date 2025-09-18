const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-[100px] md:text-[120px] font-bold">404</h1>
      <p className="text-xl font-bold mt-2">Что-то пошло не так</p>
      <p className="text-[16px] md:text-lg font-medium mt-3">Мы уже в курсе и решаем проблему.</p>
      <p className="text-[16px] md:text-lg font-medium mt-1">Попробуйте обновить страницу чуть позднее.</p>
    </div>
  );
}

export default NotFound;