import React, { useState, useContext } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { createStorehouse } from '../graphql/mutations';
import { Form, Button, Dialog, Input, Select, Notification } from 'element-react';
import { UserContext } from '../App';

function NewStorehouse() {
  const [addStorehouseDialog, setAddStorehouseDialog] = useState(false);
  const [name, setName] = useState('');
  const [tags] = useState([
    'food',
    'drink',
    'furniture',
    'appliance',
    'book',
    'vehicle'
  ]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [options, setOptions] = useState([]);
  const user = useContext(UserContext);

  const handleAddStorehouse = async user => {
    try {
      setAddStorehouseDialog(false)
      const owner = user.username;
      const input = {
        name,
        owner,
        tags: selectedTags
      }
      console.log(input)
      const result = await API.graphql(graphqlOperation(createStorehouse, { input }));
      
      console.info(`Created storehouse: id ${result.data.createStorehouse.id}`);
      setName('');
      setSelectedTags([]);
    } catch(err) {
      Notification.error({
        title: 'Error',
        message: `${err.message || 'Error adding storehouse'}`
      });
    }
  }

  const handleFilterTags = query => {
    const options = tags
      .map(tag => ({ value: tag, label: tag }))
      .filter(tag => {
        return tag.label
          .toLowerCase()
          .includes(query.toLowerCase())
      });

    setOptions(options);
  }

  return (
    <>
      <div className='storehouse-header'>
        <h1 className='storehouse-title'>
          倉庫の作成
          <Button
            type='text'
            icon='plus'
            className='storehouse-title-button'
            onClick={() => setAddStorehouseDialog(true)}
          />
        </h1>
      </div>
      <Dialog
        title='倉庫の作成'
        visible={addStorehouseDialog}
        onCancel={() => setAddStorehouseDialog(false)}
        size='large'
        customClass='dialog'
      >
        <Dialog.Body>
          <Form labelPosition='top'>
            <Form.Item label='Add Storehouse Name'>
              <Input
                placeholder='Storehouse Name'
                trim={true}
                onChange={name => setName(name)}
                value={name}
              />
            </Form.Item>
            <Form.Item label='Add Tags'>
              <Select
                multiple={true}
                filterable={true}
                placeholder='Tags'
                onChange={selectedTags => setSelectedTags(selectedTags)}
                remoteMethod={handleFilterTags}
                remote={true}
              >
                {options.map(option => (
                  <Select.Option
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Dialog.Body>
        <Dialog.Footer>
          <Button onClick={() => setAddStorehouseDialog(false)}>
            Cancel
          </Button>
          <Button
            type='primary'
            disabled={!name}
            onClick={() => handleAddStorehouse(user)}
          >
            Add
          </Button>
        </Dialog.Footer>
      </Dialog>
    </>
  )
}

export default NewStorehouse;
