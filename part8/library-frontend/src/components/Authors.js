import { useMutation, useQuery } from '@apollo/client';
import React from 'react';
import queries from '../queries';

const Authors = (props) => {
  const { loading, data } = useQuery(queries.ALL_AUTHORS);
  const [editAuthorBirthYear] = useMutation(queries.EDIT_AUTHOR_BIRTH_YEAR, {
    refetchQueries: [{ query: queries.ALL_AUTHORS }],
  });

  if (!props.show) {
    return null;
  }

  if (loading) {
    return 'Loading...';
  }

  const authors = data.allAuthors;

  const handleSubmit = (e) => {
    e.preventDefault();
    editAuthorBirthYear({ variables: { name: e.target.name.value, setBornTo: Number(e.target.birthYear.value) } });

    e.target.name.value = '';
    e.target.birthYear.value = '';
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <h3>Edit Name</h3>

        <form onSubmit={handleSubmit}>
          <label htmlFor="authorName">
            Name:
            <select name="name">
              <option selected disabled>
                Select Name
              </option>
              {authors.map((author) => (
                <option key={author.name}>{author.name}</option>
              ))}
            </select>
          </label>
          <br />
          <label htmlFor="birthYear">
            Birth Year:
            <input name="birthYear" type="number" id="birthYear" />
          </label>
          <br />
          <button type="submit">Change</button>
        </form>
      </div>
    </div>
  );
};

export default Authors;
