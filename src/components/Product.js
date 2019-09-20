import React, { useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { S3Image } from 'aws-amplify-react';
import {
  Notification,
  Popover,
  Button,
  Dialog,
  Card,
  Form,
  Input
} from 'element-react';
import { updateProduct, deleteProduct } from '../graphql/mutations';

function Product({ product }) {
  const [updateProductDialog, setUpdateProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(null);

  const handleEditProduct = () => {
    setUpdateProductDialog(true);
    setDescription(product.description);
    setPrice(product.price);
  }

  const handleUpdateProduct = async productId => {
    try {
      setUpdateProductDialog(false);
      const input = {
        id: productId,
        description,
        price
      }

      const result = await API.graphql(graphqlOperation(updateProduct, { input }));
      console.log('Update product', result)
      
      Notification({
        title: '成功',
        message: '製品の更新が完了しました！',
        type: 'success',
        duration: 2000
      });
    } catch(err) {
      console.error(`Failed to updated product with id: ${productId}`, err);
    }
  }

  const handleDeleteProduct = async productId => {
    try {
      setDeleteProductDialog(false);
      const input = { id: productId };
      await API.graphql(graphqlOperation(deleteProduct, { input }));

      Notification({
        title: '成功',
        message: '製品の削除が完了しました！',
        type: 'success',
        duration: 2000
      });
    } catch(err) {
      console.error(`Failed to deleted product with id: ${productId}`, err);
    }
  }

  return (
    <div className='card-container'>
      <Card bodyStyle={{ padding: 0, minWidth: '200px' }}>
        <S3Image
          imgKey={product.file.key}
          theme={{
            photoImg: { maxWidth: '100%', maxHeight: '100%' }
          }}
        />
        <div className='card-body'>
          <h3 className='m-0'>{product.description}</h3>
          <div className='text-right'>
            <span className='mx-1'>
              ¥{product.price}
            </span>
          </div>
        </div>
      </Card>
      {/* Update / Delete Product Buttons */}
      <div className='text-center'>
        <>
          <Button
            type='warning'
            icon='edit'
            className='m-1'
            onClick={() => handleEditProduct()}
          />
          <Popover
            placement='top'
            width='160'
            trigger='click'
            visible={deleteProductDialog}
            content={
              <>
                <p>Do you want to delete this?</p>
                <div className='text-right'>
                  <Button
                    size='mini'
                    type='text'
                    className='m-1'
                    onClick={() => setDeleteProductDialog(false)}
                  >
                    キャンセル
                  </Button>
                  <Button
                    type='primary'
                    size='mini'
                    className='m-1'
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    削除
                  </Button>
                </div>
              </>
            }
          >
            <Button
              type='danger'
              icon='delete'
              onClick={() => setDeleteProductDialog(true)}
            />
          </Popover>
        </>
      </div>

      {/* Update Product Dialog */}
      <Dialog
        title='製品の更新'
        size='large'
        customClass='dialog'
        visible={updateProductDialog}
        onCancel={() => setUpdateProductDialog(false)}
      >
        <Dialog.Body>
          <Form labelPosition='top'>
            <Form.Item label='製品の説明'>
              <Input
                type='text'
                icon='information'
                placeholder='Description'
                trim={true}
                value={description}
                onChange={description => setDescription(description)}
              />
            </Form.Item>
            <Form.Item label='製品価格'>
              <Input
                type='number'
                icon='plus'
                placeholder='...円'
                value={price}
                onChange={price => setPrice(price)}
              />
            </Form.Item>
          </Form>
        </Dialog.Body>
        <Dialog.Footer>
          <Button
            onClick={() => handleUpdateProduct(product.id)}
          >
            Update
          </Button>
        </Dialog.Footer>
      </Dialog>
    </div>
  );
}

export default Product;
