import React, { useState } from "react";
import { Storage, Auth, API, graphqlOperation } from 'aws-amplify';
import { PhotoPicker } from 'aws-amplify-react';
import { Form, Button, Input, Notification, Progress } from "element-react";
import aws_exports from '../aws-exports';
import { createProduct } from '../graphql/mutations';

function NewProduct({ storehouseId }) {
  // State
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [image, setImage] = useState('');
  const [percentUploaded, setPercentUploaded] = useState(0);

  const clearState = () => {
    setDescription('');
    setPrice('');
    setIsUploading(false);
    setImagePreview('');
    setImage('');
    setPercentUploaded(0);
  }

  const handleAddProduct = async () => {
    try {
      setIsUploading(true);

      const visibility = 'public';
      const { identityId } = await Auth.currentCredentials();
      const filename = `/${visibility}/${identityId}/${Date.now()}-${image.name}`;
      const uploadedFile = await Storage.put(filename, image.file, {
        contentType: image.type,
        progressCallback: progress => {
          const percentUploaded = Math.round(progress.loaded / progress.total) * 100;
          setPercentUploaded(percentUploaded);
        }
      });
      const file = {
        key: uploadedFile.key,
        bucket: aws_exports.aws_user_files_s3_bucket,
        region: aws_exports.aws_user_files_s3_bucket_region
      }
      const input = {
        productStorehouseId: storehouseId,
        description,
        price,
        file
      }
      const result = await API.graphql(graphqlOperation(createProduct, { input }));
      console.log('Created product', result)

      Notification({
        title: '成功',
        message: '製品の登録が完了しました！',
        type: 'success'
      });
      clearState()
    } catch(err) {
      console.error('Error adding product', err)
    }
  }

  return (
    <div className='flex-center'>
      <h2 className='header'>製品の追加</h2>
      <div>
        <Form className='storehouse-header'>
          <Form.Item label='製品の説明'>
            <Input
              type='text'
              icon='information'
              placeholder='説明文を入力'
              value={description}
              onChange={description => setDescription(description)}
            />
          </Form.Item>
          <Form.Item label='製品価格'>
            <Input
              type='number'
              icon='plus'
              placeholder='価格(円)'
              value={price}
              onChange={price => setPrice(price)}
            />
          </Form.Item>
          {imagePreview && (
            <img
              className='image-preview'
              src={imagePreview}
              alt='Produt Preview'
            />
          )}
          {percentUploaded > 0 && (
            <Progress
              type='circle'
              className='progress'
              percentage={percentUploaded}
            />
          )}
          <PhotoPicker
            title='製品画像'
            preview='hidden'
            onLoad={url => setImagePreview(url)}
            onPick={file => setImage(file)}
            theme={{
              formContainer: {
                margin: 0,
                padding: '0.8em'
              },
              sectionBody: {
                margin: 0
              },
              formSection: {
                flex: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              },
              sectionHeader: {
                padding: '0.2em',
                color: 'var(--varkAmazonOrange)'
              },
              photoPickerButton: {
                display: 'none'
              }
            }}
          />
          <Form.Item>
            <Button
              type='primary'
              disabled={!image || !description || !price || isUploading}
              onClick={handleAddProduct}
              loading={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Add Product'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default NewProduct;
