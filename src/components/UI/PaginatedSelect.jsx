import { useEffect, useState } from "react";
import { Select, Spin, message } from "antd";
import { getReq } from "../../services/getRequeset";

const PaginatedSelect = ({
  endpoint,       // masalan: "filial" yoki "firma"
  queryKey = "name", // qidirishda ishlatiladigan query param
  labelKey = "name", // option uchun label
  valueKey = "id",   // option uchun value
  value,
  onChange,
  placeholder = "Tanlang...",
}) => {
  const [options, setOptions] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchData = async (pageNum = 1, searchText = "") => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: "10",
        ...(searchText ? { [queryKey]: searchText } : {}),
      });

      const res = await getReq(`${endpoint}?${params.toString()}`);
      const newData = res.data.data || [];

      setOptions(prev =>
        pageNum === 1 ? newData : [...prev, ...newData]
      );
      setTotal(res.data.totalCount || 0);
    } catch (err) {
      message.error("Ma’lumotlarni olishda xatolik!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // search o'zgarganda 1-sahifadan yuklash
    setPage(1);
    fetchData(1, search);
  }, [search]);

  const handleScroll = e => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    // scroll oxiriga yetganda
    if (scrollTop + clientHeight >= scrollHeight - 10 && !loading) {
      if (options.length < total) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchData(nextPage, search);
      }
    }
  };

  const handleSearch = val => {
    setSearch(val);
  };

  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{ width: "100%" }}
      showSearch
      filterOption={false} // 🔹 qidirishni faqat backend orqali qilish
      onSearch={handleSearch}
      onPopupScroll={handleScroll}
      notFoundContent={loading ? <Spin size="small" /> : "Topilmadi"}
    >
      {options.map(item => (
        <Select.Option key={item[valueKey]} value={item[valueKey]}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {item?.logo && (
              <img
                src={item.logo}
                alt="logo_item"
                style={{
                  width: 25,
                  height: 25,
                  marginRight: 8,
                  objectFit: "contain",
                }}
              />
            )}
            {item[labelKey]}
          </div>
        </Select.Option>
      ))}
    </Select>
  );
};

export default PaginatedSelect;
