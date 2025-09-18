import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import Head from "next/head";
import BasicLayout from "@/layouts/BasicLayout";
import FilterBLock from "@/components/FilterBLock";
import MainSlider, { Slide } from "@/components/MainSlider";
import Breadcrumbs from "@/components/Breadcrumbs";
import H1 from "@/components/headers/H1";
import VerticalFilterBlock from "@/components/VerticalFilterBlock";
import CustomDropdown from "@/components/CustomDropdown";
import { useEffect, useMemo, useRef, useState } from "react";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";
import { Product } from "@/interfaces/Product";
import Text from "@/components/headers/Text";
import Pagination from "@/components/Pagination";
import Button from "@/components/Button";
import { getAllCategories } from "@/lib/getAllCategories";
import {
  getAllBrands,
  getBrandBySlug,
  getGenerationBySlug,
  getGenerationsByModel,
  getModelBySlug,
  getModelsByBrand,
} from "@/lib/carInfo";
import { Brand } from "@/interfaces/Brand";
import { Category } from "@/interfaces/Category";
import {
  parseAlsoParam,
  parseCatalogPath,
  parseProductQuery,
} from "@/lib/catalogRoute";
import { getProductsByFilters } from "@/lib/getProductsByFilters";
import H2 from "@/components/headers/H2";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "@/redux/loadingSlice";
import Spinner from "@/components/Spinner";
import { Model } from "@/interfaces/Model";
import {
  initialBrand,
  initialGeneration,
  initialModel,
} from "@/initialStates/initialVehicle";
import { Generation } from "@/interfaces/Generation";
import { useRouter } from "next/router";
import CustomSelect from "@/components/CustomSelect";
import CustomSortSelect, { Option } from "@/components/CustomSortSelect";
import { useUser } from "@/utils/hooks/useUser";
import { bynToRub, getNbrbRates } from "@/lib/nbrb";
import { initialCategory } from "@/initialStates/initialCategory";
import { Subcategory } from "@/interfaces/Subcategory";
import { initialSubcategory } from "@/initialStates/inititalSubcategory";
import { generateCatalogBreadcrumbs } from "@/lib/generateCatalogBreadcrumbs";
import SEO, { ListItem } from "@/components/SEO";
import { generateCatalogMeta } from "@/lib/generateCatalogMeta";

type Entity = { id: number | null; name: string; slug: string };
type OneVehicleForClient = {
  brand: Entity | null;
  model: Entity | null;
  generation: Entity | null;
};

interface ZapchastiPageProps {
  category: Category;
  subcategory: Subcategory;
  fetchProducts: {
    data: Product[];
    total: number;
    limit: number;
    page: number;
  };
  query: {
    page: number;
    limit?: number;
    priceFrom?: number;
    priceTo?: number;
    sort?: "new" | "cheapest";
  };
  also?: string[];
  primary?: { brand: string; model: string; generation: string };
  vehicles?: {
    brand: { id: number; name: string; slug: string };
    model: { id: number; name: string; slug: string };
    generation: { id: number; name: string; slug: string };
  }[];
  filtersArray: { brand_id: number; model_id: number; generation_id: number }[];
}

interface CatalogBlockProps extends ZapchastiPageProps {
  categories: {
    total: number;
    items: Category[];
  };
  brands: {
    total: number;
    items: Brand[];
  };
}

const PAGE_NAME = "catalog";
const BREADCRUMB_PAGE_NAME = "Каталог";
const LIMIT = 24;

const SLIDES: Slide[] = [
  {
    id: 1,
    content: "/resources/banners/banner1.png",
    contentSmall: "/resources/banners/banner1_small.png",
    href: "https://www.avito.ru/brands/i178902457/all?sellerId=570620353aa379e6287a9933d600367b",
  },
  {
    id: 2,
    content: "/resources/banners/banner2.png",
    contentSmall: "/resources/banners/banner2_small.png",
  },
  {
    id: 3,
    content: "/resources/banners/banner3.png",
    contentSmall: "/resources/banners/banner3_small.png",
  },
];

const SORT_OPTIONS: Option<{ sortBy: string }>[] = [
  {
    id: "",
    label: "По умолчанию",
    data: { sortBy: "" },
  },
  {
    id: "new",
    label: "Новинки",
    data: { sortBy: "new" },
  },
  {
    id: "cheapest",
    label: "Сначала дешевые",
    data: { sortBy: "cheapest" },
  },
];

const ZapchastiPage: React.FC<ZapchastiPageProps> = ({
  category,
  subcategory,
  fetchProducts,
  query,
  also,
  primary,
  vehicles,
  filtersArray,
}) => {
  const BREADCRUMBS = generateCatalogBreadcrumbs(
    category,
    subcategory,
    vehicles,
    also
  );

  const { title, description } = generateCatalogMeta({
    category: category && category.name,
    subcategory: subcategory && subcategory.name,
    vehicles: vehicles,
    also: also,
  });

  const breadcrumbsSchema: ListItem[] = BREADCRUMBS.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `https://hazparts.com${item.link}`,
  }));

  const [categories, setCategories] = useState<{
    total: number;
    items: Category[];
  }>({ total: 0, items: [] });
  const [brands, setBrands] = useState<{ total: number; items: Brand[] }>({
    total: 0,
    items: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const fetchCategories = await getAllCategories();
      setCategories(fetchCategories);
      const fetchBrands = await getAllBrands();
      setBrands(fetchBrands);
    };
    fetchData();
  }, []);

  console.log(categories);

  return (
    <>
      <SEO
        title={title}
        description={description}
        breadcrumbsSchema={breadcrumbsSchema}
      />
      <BasicLayout>
        <Breadcrumbs breadcrumbs={BREADCRUMBS} />
        <div className="flex lg:flex-row flex-col-reverse gap-5">
          <FilterBLock fetchBrands={brands} fetchCategories={categories} />
          <MainSlider slides={SLIDES} />
        </div>
        <CatalogBlock
          fetchProducts={fetchProducts}
          category={category}
          subcategory={subcategory}
          brands={brands}
          categories={categories}
          query={query}
          also={also}
          primary={primary}
          vehicles={vehicles}
          filtersArray={filtersArray}
        />
      </BasicLayout>
    </>
  );
};

const CatalogBlock: React.FC<CatalogBlockProps> = ({
  category,
  subcategory,
  fetchProducts,
  brands,
  categories,
  query,
  also,
  primary,
  vehicles,
  filtersArray,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const totalPages = Math.ceil(fetchProducts.total / LIMIT);
  const { user } = useUser();

  const [items, setItems] = useState<Product[]>(fetchProducts.data);
  const [models, setModels] = useState<Model[]>([]);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [isVisibleFilter, setIsVisibleFilter] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isVisibleSort, setIsVisibleSort] = useState<boolean>(false);

  const [search, setSearch] = useState("");

  const [sortChangedManually, setSortChangedManually] = useState(false);
  const [sortBy, setSortBy] = useState<string>(query.sort || "");

  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [page, setPage] = useState<number>(Number(query.page) || 1);

  const [localCategory, setLocalCategory] = useState<Category>(initialCategory);
  const [localSubcategory, setLocalSubcategory] =
    useState<Subcategory>(initialSubcategory);

  useEffect(() => {
    setItems(fetchProducts.data);
    setPage(Number(query.page) || 1);
  }, [fetchProducts.data, query.page]);

  useEffect(() => {
    if (openDropdown === "sortSelect") {
      setTimeout(() => setIsVisibleSort(true), 10);
    } else {
      setIsVisibleSort(false);
    }
  }, [openDropdown]);

  useEffect(() => {
    const fetchData = async () => {
      if (
        vehicles &&
        category &&
        primary?.brand &&
        !primary?.model &&
        vehicles.length <= 1
      ) {
        const fetchModels = primary?.brand
          ? await getModelsByBrand(vehicles[0].brand.id)
          : [];
        setModels(fetchModels.items);
      }
    };
    fetchData();
  }, [vehicles, category, primary?.brand, primary?.model]);

  useEffect(() => {
    const fetchData = async () => {
      if (
        vehicles &&
        category &&
        primary?.brand &&
        primary.model &&
        !primary?.generation &&
        vehicles.length <= 1
      ) {
        const fetchGenerations =
          primary?.brand && primary?.model
            ? await getGenerationsByModel(
                vehicles[0].brand.id,
                vehicles[0].model.id
              )
            : [];
        setGenerations(fetchGenerations.items);
      }
    };

    fetchData();
  }, [vehicles, category, primary?.brand, primary?.model, primary?.generation]);

  useEffect(() => {
    if (!sortChangedManually || !sortBy) return;

    dispatch(startLoading());
    setOpenDropdown("");

    const currentPath = router.asPath.split("?")[0];
    const queryParams = new URLSearchParams(router.query as any);

    queryParams.delete("slug");
    queryParams.set("sort", sortBy);
    queryParams.set("page", "1");

    router.push(`${currentPath}?${queryParams.toString()}`);
  }, [sortBy]);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleToggle = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const handleShowMore = async () => {
    setIsMoreLoading(true);
    if (isMoreLoading) return;
    const nextPage = page + 1;
    if (nextPage > totalPages) return;

    try {
      const fetchProductsMore = await getProductsByFilters({
        categoryId: category?.id ?? undefined,
        subcategoryId: subcategory?.id ?? undefined,
        priceFrom: query.priceFrom ?? undefined,
        priceTo: query.priceTo ?? undefined,
        sort: query.sort ?? undefined,
        limit: query.limit ?? undefined,
        page: nextPage,
        filtersArray,
      });

      console.log(fetchProductsMore);
      // аккуратно добавляем новые товары
      setItems((prev) => [...prev, ...fetchProductsMore.data]);
      setPage(nextPage);

      // обновляем URL, НО без GSSP (shallow)
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, page: nextPage },
        },
        undefined,
        { shallow: true, scroll: false }
      );
    } catch (e) {
      // можно показать тост
      console.error(e);
    } finally {
      setIsMoreLoading(false);
    }
  };

  const handleCategoryToggle = (cat: Category) => {
    setLocalCategory(cat);
    setLocalSubcategory(initialSubcategory);
  };

  const handleSubcategoryToggle = (sub: Subcategory, index: number) => {
    setLocalSubcategory(sub);
    dispatch(startLoading());
    const path = [
      "catalog",
      category ? category.slug : localCategory.slug,
      sub.slug,
      primary?.brand,
      primary?.model,
      primary?.generation,
    ]
      .filter(Boolean)
      .join("/");

    router.push(`/${path}`);
  };

  const handleBrandToggle = (br: Brand) => {
    dispatch(startLoading());
    const path = ["catalog", category.slug, subcategory.slug, br.slug]
      .filter(Boolean)
      .join("/");

    router.push(`/${path}`);
  };

  const handleModelToggle = (m: Model) => {
    dispatch(startLoading());
    const path = [
      "catalog",
      category.slug,
      subcategory.slug,
      primary?.brand,
      m.slug,
    ]
      .filter(Boolean)
      .join("/");

    router.push(`/${path}`);
  };

  const handleGenerationToggle = (gen: Generation) => {
    dispatch(startLoading());
    const path = [
      "catalog",
      category.slug,
      subcategory.slug,
      primary?.brand,
      primary?.model,
      gen.slug,
    ]
      .filter(Boolean)
      .join("/");

    router.push(`/${path}`);
  };

  const subName = subcategory?.name?.trim();
  const catName = category?.name?.trim();
  const baseTitle = subName || catName || "Каталог";

  const vehicleSuffix = vehicles?.length
    ? " на " +
      vehicles
        .map((v) =>
          [v.brand?.name, v.model?.name, v.generation?.name]
            .filter(Boolean)
            .join(" ")
        )
        .join(", ")
    : "";

  function useColCount() {
    const [n, setN] = useState(2);
    useEffect(() => {
      const xl = window.matchMedia("(min-width:1280px)");
      const lg = window.matchMedia("(min-width:1024px)");
      const update = () => setN(xl.matches ? 3 : lg.matches ? 2 : 2);
      update();
      xl.addEventListener("change", update);
      lg.addEventListener("change", update);
      return () => {
        xl.removeEventListener("change", update);
        lg.removeEventListener("change", update);
      };
    }, []);
    return n;
  }

  const colCount = useColCount();
  const cols = useMemo(() => {
    const arr = Array.from(
      { length: colCount },
      () => [] as typeof categories.items
    );
    categories.items.forEach((item, i) => arr[i % colCount].push(item));
    return arr;
  }, [categories.items, colCount]);

  return (
    <div className="pt-12">
      <H1 className="mb-7 sm:!text-[32px] text-[24px] !font-bold">
        {baseTitle}
        {vehicleSuffix}
      </H1>
      <div className="flex flex-row gap-5">
        <VerticalFilterBlock
          isVisibleFilter={isVisibleFilter}
          setIsVisibleFilter={setIsVisibleFilter}
          categories={categories}
          total={fetchProducts.total}
          priceFrom={query.priceFrom}
          priceTo={query.priceTo}
          primary={primary}
        />
        <div className="w-full flex flex-col items-center gap-6">
          <div className="w-full flex flex-col gap-3">
            {!category && (
              <>
                <div className="w-full">
                  <Text variant="Bold">Выберите категорию</Text>
                </div>
                <div className="w-full hidden md:grid grid-cols-2 xl:grid-cols-3 gap-6">
                  {categories.items.length === 0 ? (
                    <div className="col-span-full flex justify-center">
                      <Spinner label="Загрузка категорий" showLabel />
                    </div>
                  ) : (
                    cols.map((col, ci) => (
                      <div key={ci} className="flex flex-col gap-3">
                        {col.map((cat) => {
                          const filteredChildren = cat.subcategories.filter(
                            (c) =>
                              c.name
                                .toLowerCase()
                                .includes(search.toLowerCase())
                          );
                          return (
                            <div
                              key={cat.slug}
                              className="w-full hover:text-blue_main transition cursor-pointer"
                              onClick={() => {
                                if (openDropdown !== `subcategory-${cat.id}`) {
                                  setOpenDropdown(`subcategory-${cat.id}`);
                                } else {
                                  setOpenDropdown(null);
                                }
                                handleCategoryToggle(cat);
                              }}
                            >
                              <div className="flex flex-row items-center justify-between">
                                <Text variant="Body">{cat.name}</Text>
                                <Image
                                  src={"/resources/arrow-down.svg"}
                                  width={16}
                                  height={16}
                                  alt="Arrow"
                                  className={`${
                                    openDropdown === `subcategory-${cat.id}`
                                      ? "rotate-180"
                                      : ""
                                  } transition`}
                                />
                              </div>

                              <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                  openDropdown === `subcategory-${cat.id}`
                                    ? "max-h-[225px]"
                                    : "max-h-0"
                                }`}
                              >
                                <div className="w-full mt-1">
                                  <div className="mb-3 mt-4">
                                    <input
                                      type="text"
                                      placeholder="Поиск..."
                                      value={search}
                                      onChange={(e) =>
                                        setSearch(e.target.value)
                                      }
                                      onClick={(e) => e.stopPropagation()}
                                      className="w-full px-3 py-2 text-[14px] font-medium border border-stroke rounded-[8px] outline-none text-black_60"
                                    />
                                  </div>

                                  <div className="max-h-[170px] overflow-y-auto pb-[10px] custom-scroll">
                                    {filteredChildren.length > 0 ? (
                                      filteredChildren.map((sub, idx) => (
                                        <div
                                          key={idx}
                                          onClick={() =>
                                            handleSubcategoryToggle(sub, cat.id)
                                          }
                                          className={`py-[4px] hover:bg-gray-100 cursor-pointer text-sm text-black ${
                                            localSubcategory.id === sub.id
                                              ? "font-semibold"
                                              : ""
                                          }`}
                                        >
                                          {sub.name}
                                        </div>
                                      ))
                                    ) : (
                                      <div className="px-4 py-2 text-sm text-gray-400">
                                        Ничего не найдено
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {/* {openDropdown === `subcategory-${cat.id}` && (
                            )} */}
                            </div>
                          );
                        })}
                      </div>
                    ))
                  )}
                </div>
                <div className="w-full md:hidden flex flex-row items-center gap-2">
                  <CustomDropdown<Category>
                    name="sparepart"
                    options={categories.items ?? []}
                    placeholder="Выберите категорию"
                    value={localCategory ?? null}
                    forceOpen={openDropdown === "sparepart"}
                    onChange={handleCategoryToggle}
                    initialValue={initialCategory}
                    getChildren={(cat) => cat.subcategories}
                    childValue={localSubcategory}
                    childPlaceholder="Выберите подкатегорию"
                    onChangeChild={handleSubcategoryToggle}
                    index={2}
                  />
                </div>
              </>
            )}
            {category && !subcategory && (
              <>
                <div className="w-full">
                  <Text variant="Bold">Выберите подкатегорию</Text>
                </div>
                <div className="w-full md:grid hidden xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 gap-3">
                  {category.subcategories.length ? (
                    category.subcategories.map((sub, idx) => (
                      <div
                        key={sub.slug}
                        className="w-fit hover:text-blue_main transition cursor-pointer"
                        onClick={() => handleSubcategoryToggle(sub, 1)}
                      >
                        <Text variant="Body">{sub.name}</Text>
                      </div>
                    ))
                  ) : (
                    <Spinner label="Загрузка подкатегорий" showLabel={true} />
                  )}
                </div>
                <div className="w-full md:hidden flex flex-row items-center gap-2">
                  <CustomDropdown<Subcategory>
                    name="subcategory"
                    options={category.subcategories ?? []}
                    placeholder="Выберите подкатегорию"
                    value={null}
                    forceOpen={openDropdown === "subcategory"}
                    onChange={handleSubcategoryToggle}
                    initialValue={initialSubcategory}
                    index={1}
                  />
                </div>
              </>
            )}
            {category && subcategory && !primary?.brand && (
              <>
                <div className="w-full">
                  <Text variant="Bold">Выберите марку</Text>
                </div>
                <div className="w-full md:grid hidden xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 gap-3">
                  {brands.items.length ? (
                    brands.items.map((br, idx) => (
                      <div
                        key={br.slug}
                        className="w-fit hover:text-blue_main transition cursor-pointer"
                        onClick={() => handleBrandToggle(br)}
                      >
                        <Text variant="Body">{br.name}</Text>
                      </div>
                    ))
                  ) : (
                    <Spinner label="Загрузка марок" showLabel={true} />
                  )}
                </div>
                <div className="w-full md:hidden flex flex-row items-center gap-2">
                  <CustomDropdown<Brand>
                    name="make"
                    options={brands.items ?? []}
                    placeholder="Выберите марку"
                    value={null}
                    forceOpen={openDropdown === "make"}
                    onChange={handleBrandToggle}
                    initialValue={initialBrand}
                    index={1}
                  />
                </div>
              </>
            )}
            {vehicles && vehicles.length <= 1 && (
              <>
                {category && primary?.brand && !primary?.model && (
                  <>
                    <div className="w-full">
                      <Text variant="Bold">Выберите модель</Text>
                    </div>
                    <div className="w-full md:grid hidden xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 gap-3">
                      {models.length ? (
                        models.map((m, idx) => (
                          <div
                            key={m.slug}
                            className="w-fit hover:text-blue_main transition cursor-pointer"
                            onClick={() => handleModelToggle(m)}
                          >
                            <Text variant="Body">{m.name}</Text>
                          </div>
                        ))
                      ) : (
                        <Spinner label="Загрузка моделей" showLabel={true} />
                      )}
                    </div>
                    <div className="w-full md:hidden flex flex-row items-center gap-2">
                      <CustomDropdown<Model>
                        name="model"
                        options={models ?? []}
                        placeholder="Выберите модель"
                        value={null}
                        forceOpen={openDropdown === "model"}
                        onChange={handleModelToggle}
                        initialValue={initialModel}
                        index={1}
                      />
                    </div>
                  </>
                )}

                {category &&
                  primary?.brand &&
                  primary.model &&
                  !primary?.generation && (
                    <>
                      <div className="w-full">
                        <Text variant="Bold">Выберите поколение</Text>
                      </div>
                      <div className="w-full md:grid hidden xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 gap-3">
                        {generations.length ? (
                          generations.map((g, idx) => (
                            <div
                              key={g.slug}
                              className="w-fit hover:text-blue_main transition cursor-pointer"
                              onClick={() => handleGenerationToggle(g)}
                            >
                              <Text variant="Body">{g.name}</Text>
                            </div>
                          ))
                        ) : (
                          <Spinner
                            label="Загрузка поколений"
                            showLabel={true}
                          />
                        )}
                      </div>
                      <div className="w-full md:hidden flex flex-row items-center gap-2">
                        <CustomDropdown<Generation>
                          name="sparepart"
                          options={generations ?? []}
                          placeholder="Выберите поколение"
                          value={null}
                          forceOpen={openDropdown === "sparepart"}
                          onChange={handleGenerationToggle}
                          initialValue={initialGeneration}
                          index={1}
                        />
                      </div>
                    </>
                  )}
              </>
            )}
          </div>

          {fetchProducts.total === 0 ? (
            <H2 className="sm:!text-[32px] !text-[20px] !font-bold text-center">
              По вашему запросу ничего не найдено
            </H2>
          ) : (
            <>
              <div className="w-full flex justify-end">
                <div className="lg:max-w-[474px] w-full flex lg:flex-row flex-row-reverse items-center justify-between">
                  <p>{fetchProducts.total} запчастей</p>
                  <div className="flex flex-row gap-2 items-center">
                    <div
                      className="p-2 bg-[#F2F2F2] rounded-[8px] w-fit lg:hidden cursor-pointer"
                      onClick={() => handleToggle("sortSelect")}
                    >
                      <Image
                        src={"/resources/arrow-sort.svg"}
                        width={20}
                        height={20}
                        alt="Filter"
                      />
                    </div>
                    <div
                      className="p-2 bg-[#F2F2F2] rounded-[8px] w-fit lg:hidden cursor-pointer"
                      onClick={() => setIsVisibleFilter(true)}
                    >
                      <Image
                        src={"/resources/candle.svg"}
                        width={20}
                        height={20}
                        alt="Filter"
                      />
                    </div>
                    {openDropdown === "sortSelect" && (
                      <div className="fixed inset-0 z-50 bg-black bg-opacity-40 lg:hidden flex items-end">
                        <div
                          className="absolute inset-0"
                          onClick={() => setOpenDropdown("")}
                        ></div>

                        <div
                          className={`relative w-full bg-white px-4 py-2 z-10 transform transition-transform duration-300 ${
                            isVisibleSort ? "translate-y-0" : "translate-y-full"
                          }`}
                        >
                          <div
                            className="w-[60px] h-[2px] bg-gray-300 rounded-full mx-auto mb-4 cursor-pointer"
                            onClick={() => setOpenDropdown("")}
                          ></div>
                          <div>
                            {SORT_OPTIONS.map((opt, idx) => (
                              <div
                                key={idx}
                                onMouseDown={() => {
                                  if (!opt.data.sortBy) {
                                    dispatch(startLoading());
                                    const currentPath =
                                      router.asPath.split("?")[0];
                                    const queryParams = new URLSearchParams(
                                      router.query as any
                                    );

                                    queryParams.delete("slug");
                                    queryParams.delete("sort");
                                    queryParams.set("page", "1");

                                    setSortChangedManually(true);
                                    setSortBy("");

                                    router.push(
                                      `${currentPath}?${queryParams.toString()}`
                                    );
                                    dispatch(stopLoading());
                                  } else {
                                    setSortChangedManually(true);
                                    setSortBy(opt.data.sortBy);
                                  }
                                }}
                                className={`${
                                  idx === 0 ? "pt-[12px]" : ""
                                } px-3 py-1 cursor-pointer `}
                              >
                                <Text
                                  variant="Body"
                                  className={`${
                                    sortBy === opt.id ? "!font-bold" : ""
                                  }`}
                                >
                                  {opt.label}
                                </Text>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div ref={wrapperRef} className="lg:block hidden">
                    <CustomSortSelect<{
                      sortBy: string;
                    }>
                      value={sortBy}
                      placeholder=""
                      type="sort"
                      options={SORT_OPTIONS}
                      onChange={(selected) => {
                        if (!selected.sortBy) {
                          dispatch(startLoading());
                          const currentPath = router.asPath.split("?")[0];
                          const queryParams = new URLSearchParams(
                            router.query as any
                          );

                          queryParams.delete("slug");
                          queryParams.delete("sort");
                          queryParams.set("page", "1");

                          setSortChangedManually(true);
                          setSortBy(""); // сброс локального состояния

                          router.push(
                            `${currentPath}?${queryParams.toString()}`
                          );
                          dispatch(stopLoading());
                        } else {
                          setSortChangedManually(true);
                          setSortBy(selected.sortBy);
                        }
                      }}
                      openWidth="w-[264px]"
                      selectWidth="w-[210px]"
                    />
                  </div>
                </div>
              </div>
              <div className="w-full grid xxlg:grid-cols-3 grid-cols-2 sm:gap-x-5 gap-x-4 sm:gap-y-7 gap-y-6">
                {items.map((product, idx) => (
                  <div key={idx}>
                    <ProductCard product={product} user={user} />
                  </div>
                ))}
              </div>
              <div className="w-full flex flex-col gap-5 items-center md:mt-7 mt-1">
                {totalPages > 1 && (
                  <>
                    {page !== totalPages && (
                      <Button
                        text={isMoreLoading ? "Загрузка..." : "Показать еще"}
                        onClick={handleShowMore}
                        styles={`max-w-[480px] w-full py-[16px] text-center border border-stroke rounded-[8px] text-black text-[16px] font-semibold outline-none hover:bg-stroke transition`}
                        disabled={isMoreLoading}
                      />
                    )}
                    <Pagination currentPage={page} totalPages={totalPages} />
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const segs = (context.params?.slug as string[]) || [];
  const q = parseProductQuery(context.query);
  const page = Number(q.page) || 1;
  const also = parseAlsoParam(context.query.also).slice(0, 2);

  const { rub } = await getNbrbRates();

  const toRubFromQuery = (v?: number) => {
    if (v == null) return undefined;
    return Math.round(bynToRub(v, rub));
  };

  const priceFromRub = toRubFromQuery(q.priceFrom ?? undefined);
  const priceToRub = toRubFromQuery(q.priceTo ?? undefined);

  const parsed = await parseCatalogPath(segs);

  if (parsed.leftover && parsed.leftover.length > 0) return { notFound: true };

  if (!parsed.categorySlugId && !parsed.primary.brand && segs.length === 0) {
    const fetchProducts = await getProductsByFilters({
      page: page,
      limit: q.limit,
      priceFrom: priceFromRub ?? undefined,
      priceTo: priceToRub ?? undefined,
      sort: q.sort ?? undefined,
      filtersArray: [],
    });
    return {
      props: {
        category: null,
        fetchProducts,
        primary: parsed.primary,
        also,
        query: { ...q, page },
        vehicles: { brand: null, model: null, generation: null },
      },
    };
  }

  const category = parsed.categoryEntity ?? null;
  if (parsed.categorySlugId && !category) return { notFound: true };
  const subcategory = parsed.subcategoryEntity ?? null;
  if (parsed.subcategorySlugId && !subcategory) return { notFound: true };

  // Собираем массив выбранных авто (primary + also), максимум 3
  const vehiclesSlugs = [parsed.primary, ...also]
    .filter((v) => v?.brand)
    .slice(0, 3);

  // Прямо здесь делаем по одному запросу на бренд/модель/поколение для каждого авто
  const vehiclesForClient: OneVehicleForClient[] = [];
  const filtersArray: {
    brand_id: number;
    model_id?: number;
    generation_id?: number;
  }[] = [];

  for (const v of vehiclesSlugs) {
    // brand
    const brandResp = await getBrandBySlug(v.brand!); // гарантированно есть brand
    const brand = brandResp.items[0] ?? null;
    if (!brand?.id) return { notFound: true };

    // model (если есть)
    let model: Entity | null = null;
    if (v.model) {
      const modelResp = await getModelBySlug(v.model);
      model = modelResp.items[0] ?? null;
      if (!model?.id) return { notFound: true };
    }

    // generation (если есть)
    let generation: Entity | null = null;
    if (v.generation) {
      const genResp = await getGenerationBySlug(v.generation);
      generation = genResp.items[0] ?? null;
      if (!generation?.id) return { notFound: true };
    }

    vehiclesForClient.push({
      brand: { id: brand.id!, name: brand.name, slug: brand.slug },
      model: model
        ? { id: model.id!, name: model.name, slug: model.slug }
        : null,
      generation: generation
        ? { id: generation.id!, name: generation.name, slug: generation.slug }
        : null,
    });

    filtersArray.push({
      brand_id: brand.id!,
      ...(model?.id ? { model_id: model.id! } : {}),
      ...(generation?.id ? { generation_id: generation.id! } : {}),
    });
  }

  const fetchProducts = await getProductsByFilters({
    limit: q.limit,
    page: page,
    categoryId: category?.id,
    subcategoryId: subcategory?.id,
    priceFrom: priceFromRub ?? undefined,
    priceTo: priceToRub ?? undefined,
    sort: q.sort ?? undefined,
    filtersArray,

    // alsoVehicles: also.map((a) => ({
    //   brandSlug: a.brand || undefined,
    //   modelSlug: a.model || undefined,
    //   generationSlug: a.generation || undefined,
    // })),
  });

  return {
    props: {
      category,
      subcategory,
      fetchProducts,
      primary: parsed.primary,
      also,
      query: { ...q, page },
      vehicles: vehiclesForClient,
      filtersArray,
    },
  };
};

export default ZapchastiPage;
