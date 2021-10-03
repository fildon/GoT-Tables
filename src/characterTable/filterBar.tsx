import React from "react";

interface FilterBarProps {
  isLoading: boolean;
  setFilters: (filters: Record<string, string>) => void;
}

const initialFilterState = {
  name: "",
  gender: "",
  culture: "",
  born: "",
  died: "",
};

export const FilterBar = ({
  isLoading,
  setFilters,
}: FilterBarProps): JSX.Element => {
  const [filterState, setFilterState] = React.useState(initialFilterState);

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    setFilterState({ ...filterState, [name]: value });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFilters(filterState);
  };

  const clearFilters = () => {
    setFilterState(initialFilterState);
    setFilters(initialFilterState);
  };

  return (
    <form onSubmit={handleSubmit} className="filterBar">
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={filterState.name}
          onChange={handleInputChange}
          disabled={isLoading}
        />
      </label>
      <label>
        Gender:
        <input
          type="text"
          name="gender"
          value={filterState.gender}
          onChange={handleInputChange}
          disabled={isLoading}
        />
      </label>
      <label>
        Culture:
        <input
          type="text"
          name="culture"
          value={filterState.culture}
          onChange={handleInputChange}
          disabled={isLoading}
        />
      </label>
      <label>
        Born:
        <input
          type="text"
          name="born"
          value={filterState.born}
          onChange={handleInputChange}
          disabled={isLoading}
        />
      </label>
      <label>
        Died:
        <input
          type="text"
          name="died"
          value={filterState.died}
          onChange={handleInputChange}
          disabled={isLoading}
        />
      </label>
      <input type="submit" value="Apply filters" disabled={isLoading} />
      <button onClick={clearFilters} disabled={isLoading}>
        Clear filters
      </button>
    </form>
  );
};
