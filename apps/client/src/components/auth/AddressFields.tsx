import provinces from '../../data/address/provinces.json';
import districts from '../../data/address/districts.json';
import cities from '../../data/address/cities.json';

export interface AddressValue {
  province: string;
  district: string;
  city: string;
  streetAddress: string;
}

interface Props {
  value: AddressValue;
  onChange: (v: AddressValue) => void;
}

export default function AddressFields({ value, onChange }: Props) {
  const selectedProvince = provinces.find((p) => p.name_en === value.province);
  const filteredDistricts = selectedProvince
    ? districts.filter((d) => d.province_id === selectedProvince.id)
    : [];
  const selectedDistrict = filteredDistricts.find((d) => d.name_en === value.district);
  const filteredCities = selectedDistrict
    ? cities.filter((c) => c.district_id === selectedDistrict.id)
    : [];

  const set = (field: keyof AddressValue) => (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const updated = { ...value, [field]: e.target.value };
    if (field === 'province') { updated.district = ''; updated.city = ''; }
    if (field === 'district') { updated.city = ''; }
    onChange(updated);
  };

  const selectCls = 'w-full border-2 border-gray-200 rounded-xl px-3 py-3 text-sm focus:border-primary focus:outline-none';

  return (
    <div className="space-y-3">
      <select value={value.province} onChange={set('province')} className={selectCls}>
        <option value="">Select Province *</option>
        {provinces.map((p) => <option key={p.id} value={p.name_en}>{p.name_en}</option>)}
      </select>

      <select value={value.district} onChange={set('district')} disabled={!value.province} className={selectCls}>
        <option value="">Select District *</option>
        {filteredDistricts.map((d) => <option key={d.id} value={d.name_en}>{d.name_en}</option>)}
      </select>

      <select value={value.city} onChange={set('city')} disabled={!value.district} className={selectCls}>
        <option value="">Select City *</option>
        {filteredCities.map((c) => <option key={c.id} value={c.name_en}>{c.name_en}</option>)}
      </select>

      <input
        type="text"
        value={value.streetAddress}
        onChange={set('streetAddress')}
        placeholder="Street Address *"
        className="w-full border-2 border-gray-200 rounded-xl px-3 py-3 text-sm focus:border-primary focus:outline-none"
      />
    </div>
  );
}
